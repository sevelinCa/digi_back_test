
CREATE TABLE DigiFranchise (
    ID CHAR(36) PRIMARY KEY, 
    userFullname VARCHAR(255),
    userId CHAR(36),
    CreationDate TIMESTAMP,
);


CREATE TABLE FixedExpenseCategory (
    id UUID PRIMARY KEY,
    userId UUID,
    fixedExpense VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE Expense (
    ID CHAR(36) PRIMARY KEY,
    TransactionID CHAR(36),
    FixedExpenseCategory VARCHAR(255),
    Amount DECIMAL(10, 2),
    Date TIMESTAMP,
    FOREIGN KEY (TransactionID) REFERENCES Transaction(ID)
);

CREATE TABLE Income (
    ID CHAR(36) PRIMARY KEY,
    FranchiseID CHAR(36),
    Source VARCHAR(255),
    Description VARCHAR(255),
    Amount DECIMAL(10, 2),
    UnitiCost DECIMAL(10, 2),
    Quantity INT,
    IncomeDate TIMESTAMP,
    TransactionID CHAR(36) NULL,
    FOREIGN KEY (FranchiseID) REFERENCES DigiFranchise(ID),
    FOREIGN KEY (TransactionID) REFERENCES Transaction(ID)
);


CREATE TABLE Asset (
    ID CHAR(36) PRIMARY KEY,
    FranchiseID CHAR(36),
    Name VARCHAR(255),
    PurchasePrice DECIMAL(10, 2),
    PurchaseDate TIMESTAMP,
    DepreciationRate DECIMAL(5, 2),
    CurrentValue DECIMAL(10, 2),
    FOREIGN KEY (FranchiseID) REFERENCES DigiFranchise(ID)
);

CREATE TABLE Inventory (
    ID CHAR(36) PRIMARY KEY,
    AssetID CHAR(36),
    FranchiseID CHAR(36),
    ItemName VARCHAR(255),
    Quantity INT,
    CostPerItem DECIMAL(10, 2),
    TotalValue DECIMAL(10, 2),
    DateReceived Date
    FOREIGN KEY (AssetID) REFERENCES Asset(ID),
    FOREIGN KEY (FranchiseID) REFERENCES DigiFranchise(ID)
);


CREATE TABLE Funding (
    ID CHAR(36) PRIMARY KEY,
    FranchiseID CHAR(36),
    Source VARCHAR(255),
    MonthReceived INT,
    RepaymentTerm INT,
    AnnualInterestRate DECIMAL(5, 2),
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FranchiseID) REFERENCES DigiFranchise(ID)
);

CREATE TABLE Deposit (
    ID CHAR(36) PRIMARY KEY,
    FranchiseID CHAR(36),
    Item VARCHAR(255),
    MonthPaid INT,
    MonthRecovered INT,
    DepositAmount DECIMAL(10, 2),
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FranchiseID) REFERENCES DigiFranchise(ID)
);

CREATE TABLE OperatingParameters (
    ID CHAR(36) PRIMARY KEY,
    FranchiseID CHAR(36),
    SalesPaidByCreditCard DECIMAL(5, 2),
    SalesMadeOnCredit DECIMAL(5, 2),
    AverageCreditorTerms INT,
    AverageDebtorTerms INT,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (FranchiseID) REFERENCES DigiFranchise(ID)
);
