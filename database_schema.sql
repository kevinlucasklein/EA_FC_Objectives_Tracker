-- Rewards table
CREATE TABLE Rewards (
    RewardID INT PRIMARY KEY,
    Type VARCHAR(50),
    Value INT,
    Description TEXT,
    Rarity VARCHAR(20)
);

-- Objective Types table
CREATE TABLE ObjectiveTypes (
    TypeID INT PRIMARY KEY,
    Name VARCHAR(100)
);

-- Objective Groups table
CREATE TABLE ObjectiveGroups (
    GroupID INT PRIMARY KEY,
    TypeID INT,
    Name VARCHAR(100),
    StartTime TIMESTAMP NULL,
    ExpirationTime TIMESTAMP NULL,
    FOREIGN KEY (TypeID) REFERENCES ObjectiveTypes(TypeID)
);

-- Objectives table
CREATE TABLE Objectives (
    ObjectiveID INT PRIMARY KEY,
    GroupID INT,
    Name VARCHAR(100),
    Description TEXT,
    RewardID INT,
    FOREIGN KEY (GroupID) REFERENCES ObjectiveGroups(GroupID),
    FOREIGN KEY (RewardID) REFERENCES Rewards(RewardID)
);

-- Requirements table
CREATE TABLE Requirements (
    RequirementID INT PRIMARY KEY,
    ObjectiveID INT,
    Type VARCHAR(50),
    Value INT,
    FOREIGN KEY (ObjectiveID) REFERENCES Objectives(ObjectiveID)
);

-- Conditions table
CREATE TABLE Conditions (
    ConditionID INT PRIMARY KEY,
    RequirementID INT,
    Type VARCHAR(50),
    Value VARCHAR(100),
    FOREIGN KEY (RequirementID) REFERENCES Requirements(RequirementID)
);

-- MultiMatchRequirements table
CREATE TABLE MultiMatchRequirements (
    MultiMatchID INT PRIMARY KEY,
    RequirementID INT,
    MatchCount INT,
    FOREIGN KEY (RequirementID) REFERENCES Requirements(RequirementID)
);

-- Countries table
CREATE TABLE Countries (
    CountryID INT PRIMARY KEY,
    Name VARCHAR(100)
);

-- Teams table
CREATE TABLE Teams (
    TeamID INT PRIMARY KEY,
    Name VARCHAR(100),
    LeagueID INT
);

-- ConditionCountries junction table
CREATE TABLE ConditionCountries (
    ConditionID INT,
    CountryID INT,
    PRIMARY KEY (ConditionID, CountryID),
    FOREIGN KEY (ConditionID) REFERENCES Conditions(ConditionID),
    FOREIGN KEY (CountryID) REFERENCES Countries(CountryID)
);

-- ConditionTeams junction table
CREATE TABLE ConditionTeams (
    ConditionID INT,
    TeamID INT,
    PRIMARY KEY (ConditionID, TeamID),
    FOREIGN KEY (ConditionID) REFERENCES Conditions(ConditionID),
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID)
);

-- PlayerAttributes table
CREATE TABLE PlayerAttributes (
    AttributeID INT PRIMARY KEY,
    Name VARCHAR(50)
);

-- ConditionPlayerAttributes junction table
CREATE TABLE ConditionPlayerAttributes (
    ConditionID INT,
    AttributeID INT,
    MinValue INT,
    PRIMARY KEY (ConditionID, AttributeID),
    FOREIGN KEY (ConditionID) REFERENCES Conditions(ConditionID),
    FOREIGN KEY (AttributeID) REFERENCES PlayerAttributes(AttributeID)
);

-- GameModes table
CREATE TABLE GameModes (
    GameModeID INT PRIMARY KEY,
    Name VARCHAR(50)
);

-- ObjectiveGameModes junction table
CREATE TABLE ObjectiveGameModes (
    ObjectiveID INT,
    GameModeID INT,
    PRIMARY KEY (ObjectiveID, GameModeID),
    FOREIGN KEY (ObjectiveID) REFERENCES Objectives(ObjectiveID),
    FOREIGN KEY (GameModeID) REFERENCES GameModes(GameModeID)
);

-- Players table
CREATE TABLE Players (
    PlayerID INT PRIMARY KEY,
    Name VARCHAR(100)
);

-- PlayerProgress table
CREATE TABLE PlayerProgress (
    PlayerID INT,
    ObjectiveID INT,
    Progress INT,
    Completed BOOLEAN,
    CompletionDate TIMESTAMP,
    PRIMARY KEY (PlayerID, ObjectiveID),
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID),
    FOREIGN KEY (ObjectiveID) REFERENCES Objectives(ObjectiveID)
);

-- PlayerMultiMatchProgress table
CREATE TABLE PlayerMultiMatchProgress (
    PlayerID INT,
    MultiMatchID INT,
    MatchesCompleted INT,
    GoalsScored INT,
    PRIMARY KEY (PlayerID, MultiMatchID),
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID),
    FOREIGN KEY (MultiMatchID) REFERENCES MultiMatchRequirements(MultiMatchID)
);

-- PlayerGroupProgress table
CREATE TABLE PlayerGroupProgress (
    PlayerID INT,
    GroupID INT,
    Completed BOOLEAN,
    CompletionDate TIMESTAMP,
    PRIMARY KEY (PlayerID, GroupID),
    FOREIGN KEY (PlayerID) REFERENCES Players(PlayerID),
    FOREIGN KEY (GroupID) REFERENCES ObjectiveGroups(GroupID)
);

-- View to check objective completion status
CREATE VIEW ObjectiveCompletionStatus AS
SELECT 
    p.PlayerID,
    o.ObjectiveID,
    o.Name AS ObjectiveName,
    og.GroupID,
    og.Name AS GroupName,
    ot.TypeID,
    ot.Name AS TypeName,
    pp.Progress,
    pp.Completed,
    pp.CompletionDate
FROM Players p
CROSS JOIN Objectives o
LEFT JOIN PlayerProgress pp ON p.PlayerID = pp.PlayerID AND o.ObjectiveID = pp.ObjectiveID
JOIN ObjectiveGroups og ON o.GroupID = og.GroupID
JOIN ObjectiveTypes ot ON og.TypeID = ot.TypeID;

-- View to check group completion status
CREATE VIEW GroupCompletionStatus AS
SELECT 
    p.PlayerID,
    og.GroupID,
    og.Name AS GroupName,
    ot.TypeID,
    ot.Name AS TypeName,
    CASE 
        WHEN BOOL_AND(COALESCE(pp.Completed, FALSE)) THEN TRUE
        ELSE FALSE
    END AS Completed,
    MAX(pp.CompletionDate) AS CompletionDate
FROM Players p
CROSS JOIN ObjectiveGroups og
JOIN ObjectiveTypes ot ON og.TypeID = ot.TypeID
LEFT JOIN Objectives o ON og.GroupID = o.GroupID
LEFT JOIN PlayerProgress pp ON p.PlayerID = pp.PlayerID AND o.ObjectiveID = pp.ObjectiveID
GROUP BY p.PlayerID, og.GroupID, og.Name, ot.TypeID, ot.Name;

CREATE OR REPLACE FUNCTION UpdateObjectiveProgress(
    p_PlayerID INT, 
    p_ObjectiveID INT, 
    p_Progress INT
) RETURNS BOOLEAN AS $$
DECLARE
    v_Completed BOOLEAN;
    v_RequiredProgress INT;
BEGIN
    -- Get the required progress for the objective
    SELECT Value INTO v_RequiredProgress
    FROM Requirements
    WHERE ObjectiveID = p_ObjectiveID AND Type = 'Progress';
    
    -- Determine if the objective is completed
    v_Completed := (p_Progress >= v_RequiredProgress);
    
    -- Update the progress
    INSERT INTO PlayerProgress (PlayerID, ObjectiveID, Progress, Completed, CompletionDate)
    VALUES (p_PlayerID, p_ObjectiveID, p_Progress, v_Completed, CASE WHEN v_Completed THEN NOW() ELSE NULL END)
    ON CONFLICT (PlayerID, ObjectiveID) DO UPDATE SET
        Progress = p_Progress,
        Completed = v_Completed,
        CompletionDate = CASE WHEN v_Completed AND PlayerProgress.Completed = false THEN NOW() ELSE PlayerProgress.CompletionDate END;
    
    -- Update group completion if necessary
    IF v_Completed THEN
        PERFORM UpdateGroupCompletion(p_PlayerID, p_ObjectiveID);
    END IF;
    
    RETURN v_Completed;
END;
$$ LANGUAGE plpgsql;

-- Procedure to update group completion
CREATE OR REPLACE PROCEDURE UpdateGroupCompletion(
    p_PlayerID INT,
    p_ObjectiveID INT
) AS $$
DECLARE
    v_GroupID INT;
    v_GroupCompleted BOOLEAN;
BEGIN
    -- Get the group ID for the objective
    SELECT GroupID INTO v_GroupID
    FROM Objectives
    WHERE ObjectiveID = p_ObjectiveID;
    
    -- Check if all objectives in the group are completed
    SELECT BOOL_AND(Completed) INTO v_GroupCompleted
    FROM PlayerProgress pp
    JOIN Objectives o ON pp.ObjectiveID = o.ObjectiveID
    WHERE pp.PlayerID = p_PlayerID AND o.GroupID = v_GroupID;
    
    -- Update group completion status
    IF v_GroupCompleted THEN
        INSERT INTO PlayerGroupProgress (PlayerID, GroupID, Completed, CompletionDate)
        VALUES (p_PlayerID, v_GroupID, TRUE, NOW())
        ON CONFLICT (PlayerID, GroupID) DO UPDATE SET
            Completed = TRUE,
            CompletionDate = CASE WHEN PlayerGroupProgress.Completed = false THEN NOW() ELSE PlayerGroupProgress.CompletionDate END;
    END IF;
END;
$$ LANGUAGE plpgsql;