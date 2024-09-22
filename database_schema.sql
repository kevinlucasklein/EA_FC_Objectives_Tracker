-- Create Tables

-- Rewards table
CREATE TABLE Rewards (
    RewardID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Type VARCHAR(50),
    Value INT,
    Description TEXT,
    Rarity VARCHAR(20)
);

-- Objective Types table
CREATE TABLE ObjectiveTypes (
    TypeID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(100)
);

-- Objective Groups table
CREATE TABLE ObjectiveGroups (
    GroupID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    TypeID INT,
    Name VARCHAR(100),
    StartTime TIMESTAMP NULL,
    ExpirationTime TIMESTAMP NULL,
    FOREIGN KEY (TypeID) REFERENCES ObjectiveTypes(TypeID)
);

-- Objectives table
CREATE TABLE Objectives (
    ObjectiveID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    GroupID INT,
    Name VARCHAR(100),
    Description TEXT,
    RewardID INT,
    FOREIGN KEY (GroupID) REFERENCES ObjectiveGroups(GroupID),
    FOREIGN KEY (RewardID) REFERENCES Rewards(RewardID)
);

-- Requirements table
CREATE TABLE Requirements (
    RequirementID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ObjectiveID INT,
    Type VARCHAR(50),
    Value INT,
    FOREIGN KEY (ObjectiveID) REFERENCES Objectives(ObjectiveID)
);

-- Conditions table
CREATE TABLE Conditions (
    ConditionID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RequirementID INT,
    Type VARCHAR(50),
    Value VARCHAR(100),
    FOREIGN KEY (RequirementID) REFERENCES Requirements(RequirementID)
);

-- Countries table
CREATE TABLE Countries (
    CountryID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(100)
);

-- Teams table
CREATE TABLE Teams (
    TeamID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(100),
    LeagueID INT
);

-- PlayerAttributes table
CREATE TABLE PlayerAttributes (
    AttributeID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(50)
);

-- GameModes table
CREATE TABLE GameModes (
    GameModeID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Name VARCHAR(50)
);

-- MultiMatchRequirements table
CREATE TABLE MultiMatchRequirements (
    MultiMatchID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    RequirementID INT,
    MatchCount INT,
    FOREIGN KEY (RequirementID) REFERENCES Requirements(RequirementID)
);

-- Users table
CREATE TABLE Users (
    UserID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastLogin TIMESTAMP,
    UNIQUE (Username),
    UNIQUE (Email)
);

-- ConditionCountries table (Composite Primary Key)
CREATE TABLE ConditionCountries (
    ConditionID INT NOT NULL,
    CountryID INT NOT NULL,
    PRIMARY KEY (ConditionID, CountryID),
    FOREIGN KEY (ConditionID) REFERENCES Conditions(ConditionID),
    FOREIGN KEY (CountryID) REFERENCES Countries(CountryID)
);

-- ConditionTeams table (Composite Primary Key)
CREATE TABLE ConditionTeams (
    ConditionID INT NOT NULL,
    TeamID INT NOT NULL,
    PRIMARY KEY (ConditionID, TeamID),
    FOREIGN KEY (ConditionID) REFERENCES Conditions(ConditionID),
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID)
);

-- ConditionPlayerAttributes table (Composite Primary Key)
CREATE TABLE ConditionPlayerAttributes (
    ConditionID INT NOT NULL,
    AttributeID INT NOT NULL,
    MinValue INT,
    PRIMARY KEY (ConditionID, AttributeID),
    FOREIGN KEY (ConditionID) REFERENCES Conditions(ConditionID),
    FOREIGN KEY (AttributeID) REFERENCES PlayerAttributes(AttributeID)
);

-- ObjectiveGameModes table (Composite Primary Key)
CREATE TABLE ObjectiveGameModes (
    ObjectiveID INT NOT NULL,
    GameModeID INT NOT NULL,
    PRIMARY KEY (ObjectiveID, GameModeID),
    FOREIGN KEY (ObjectiveID) REFERENCES Objectives(ObjectiveID),
    FOREIGN KEY (GameModeID) REFERENCES GameModes(GameModeID)
);

-- PlayerProgress table (Composite Primary Key)
CREATE TABLE PlayerProgress (
    UserID INT NOT NULL,
    ObjectiveID INT NOT NULL,
    Progress INT,
    Completed BOOLEAN,
    CompletionDate TIMESTAMP,
    PRIMARY KEY (UserID, ObjectiveID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ObjectiveID) REFERENCES Objectives(ObjectiveID)
);

-- PlayerGroupProgress table (Composite Primary Key)
CREATE TABLE PlayerGroupProgress (
    UserID INT NOT NULL,
    GroupID INT NOT NULL,
    Completed BOOLEAN,
    CompletionDate TIMESTAMP,
    PRIMARY KEY (UserID, GroupID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (GroupID) REFERENCES ObjectiveGroups(GroupID)
);

-- PlayerMultiMatchProgress table (Composite Primary Key)
CREATE TABLE PlayerMultiMatchProgress (
    UserID INT NOT NULL,
    MultiMatchID INT NOT NULL,
    MatchesCompleted INT,
    GoalsScored INT,
    PRIMARY KEY (UserID, MultiMatchID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (MultiMatchID) REFERENCES MultiMatchRequirements(MultiMatchID)
);

-- Create Views

-- GroupCompletionStatus view
CREATE VIEW GroupCompletionStatus AS
SELECT
    u.UserID,
    og.GroupID,
    og.Name AS GroupName,
    ot.TypeID,
    ot.Name AS TypeName,
    CASE
        WHEN BOOL_AND(COALESCE(pp.Completed, FALSE)) THEN TRUE
        ELSE FALSE
    END AS Completed,
    MAX(pp.CompletionDate) AS CompletionDate
FROM
    Users u
    CROSS JOIN ObjectiveGroups og
    JOIN ObjectiveTypes ot ON og.TypeID = ot.TypeID
    LEFT JOIN Objectives o ON og.GroupID = o.GroupID
    LEFT JOIN PlayerProgress pp ON u.UserID = pp.UserID AND o.ObjectiveID = pp.ObjectiveID
GROUP BY
    u.UserID, og.GroupID, og.Name, ot.TypeID, ot.Name;

-- ObjectiveCompletionStatus view
CREATE VIEW ObjectiveCompletionStatus AS
SELECT
    u.UserID,
    o.ObjectiveID,
    o.Name AS ObjectiveName,
    og.GroupID,
    og.Name AS GroupName,
    ot.TypeID,
    ot.Name AS TypeName,
    pp.Progress,
    pp.Completed,
    pp.CompletionDate
FROM
    Users u
    CROSS JOIN Objectives o
    LEFT JOIN PlayerProgress pp ON u.UserID = pp.UserID AND o.ObjectiveID = pp.ObjectiveID
    JOIN ObjectiveGroups og ON o.GroupID = og.GroupID
    JOIN ObjectiveTypes ot ON og.TypeID = ot.TypeID;

-- Stored Procedures and Functions

-- Function to update objective progress
CREATE OR REPLACE FUNCTION UpdateObjectiveProgress(
    p_UserID INT, 
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
    INSERT INTO PlayerProgress (UserID, ObjectiveID, Progress, Completed, CompletionDate)
    VALUES (p_UserID, p_ObjectiveID, p_Progress, v_Completed, CASE WHEN v_Completed THEN NOW() ELSE NULL END)
    ON CONFLICT (UserID, ObjectiveID) DO UPDATE SET
        Progress = p_Progress,
        Completed = v_Completed,
        CompletionDate = CASE WHEN v_Completed AND PlayerProgress.Completed = FALSE THEN NOW() ELSE PlayerProgress.CompletionDate END;
    
    -- Update group completion if necessary
    IF v_Completed THEN
        PERFORM UpdateGroupCompletion(p_UserID, p_ObjectiveID);
    END IF;
    
    RETURN v_Completed;
END;
$$ LANGUAGE plpgsql;

-- Procedure to update group completion
CREATE OR REPLACE PROCEDURE UpdateGroupCompletion(
    p_UserID INT,
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
    SELECT BOOL_AND(pp.Completed) INTO v_GroupCompleted
    FROM PlayerProgress pp
    JOIN Objectives o ON pp.ObjectiveID = o.ObjectiveID
    WHERE pp.UserID = p_UserID AND o.GroupID = v_GroupID;
    
    -- Update group completion status
    IF v_GroupCompleted THEN
        INSERT INTO PlayerGroupProgress (UserID, GroupID, Completed, CompletionDate)
        VALUES (p_UserID, v_GroupID, TRUE, NOW())
        ON CONFLICT (UserID, GroupID) DO UPDATE SET
            Completed = TRUE,
            CompletionDate = CASE WHEN PlayerGroupProgress.Completed = FALSE THEN NOW() ELSE PlayerGroupProgress.CompletionDate END;
    END IF;
END;
$$ LANGUAGE plpgsql;
