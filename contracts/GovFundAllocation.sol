// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GovFundAllocation {

    address public admin;

    mapping(address => bool) public authorizedOfficers;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyOfficer() {
        require(
            authorizedOfficers[msg.sender] || msg.sender == admin,
            "Not authorized"
        );
        _;
    }

    // ─────────────────────────────────────────────
    //  DATA STRUCTURES
    // ─────────────────────────────────────────────

    struct FundRecord {
        uint256 recordId;           // Unique ID of this record
        string  eventName;          // Name of the govt project/scheme
        string  contractorName;     // Contractor assigned
        uint256 projectEstimate;    // Total estimated cost (in wei or custom unit)
        uint256 fundAllocated;      // Fund allocated in THIS transaction
        uint256 totalFundTillNow;   // Cumulative fund allocated to project so far
        uint256 timestamp;          // Block timestamp
        address recordedBy;         // Officer who recorded this
        string  remarks;            // Optional remarks / notes
        bool    exists;             // Guard flag
    }

    // projectId => list of record IDs
    mapping(string => uint256[]) public projectRecords;

    // recordId => FundRecord
    mapping(uint256 => FundRecord) public records;

    // projectId => cumulative funds
    mapping(string => uint256) public projectTotalFunds;

    // projectId => estimate (set once, can be updated by admin)
    mapping(string => uint256) public projectEstimates;

    uint256 public recordCounter;

    // ─────────────────────────────────────────────
    //  EVENTS  (emitted on every allocation)
    // ─────────────────────────────────────────────

    event FundAllocated(
        uint256 indexed recordId,
        string  indexed projectId,
        string  eventName,
        string  contractorName,
        uint256 projectEstimate,
        uint256 fundAllocated,
        uint256 totalFundTillNow,
        uint256 timestamp,
        address recordedBy
    );

    event OfficerAdded(address officer);
    event OfficerRemoved(address officer);
    event EstimateUpdated(string projectId, uint256 newEstimate);

    // ─────────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────────

    constructor() {
        admin = msg.sender;
        authorizedOfficers[msg.sender] = true;
    }

    // ─────────────────────────────────────────────
    //  ADMIN FUNCTIONS
    // ─────────────────────────────────────────────

    function addOfficer(address _officer) external onlyAdmin {
        authorizedOfficers[_officer] = true;
        emit OfficerAdded(_officer);
    }

    function removeOfficer(address _officer) external onlyAdmin {
        authorizedOfficers[_officer] = false;
        emit OfficerRemoved(_officer);
    }

    /**
     * @dev Set or update the project estimate.
     *      Should ideally be set before any allocations.
     */
    function setProjectEstimate(
        string calldata _projectId,
        uint256 _estimate
    ) external onlyAdmin {
        require(_estimate > 0, "Estimate must be > 0");
        projectEstimates[_projectId] = _estimate;
        emit EstimateUpdated(_projectId, _estimate);
    }

    // ─────────────────────────────────────────────
    //  CORE FUNCTION: Allocate Funds
    // ─────────────────────────────────────────────

    /**
     * @dev Record a new fund allocation for a government project.
     *
     * @param _projectId       Short unique ID for the project  (e.g. "PROJ-2024-001")
     * @param _eventName       Descriptive name  (e.g. "NH-44 Highway Widening Phase 2")
     * @param _contractorName  Name of the contractor
     * @param _fundAllocated   Amount being allocated in this transaction (in smallest unit)
     * @param _remarks         Any additional remarks
     */
    function allocateFund(
        string calldata _projectId,
        string calldata _eventName,
        string calldata _contractorName,
        uint256         _fundAllocated,
        string calldata _remarks
    ) external onlyOfficer returns (uint256 recordId) {

        require(bytes(_projectId).length > 0,      "Project ID required");
        require(bytes(_eventName).length > 0,      "Event name required");
        require(bytes(_contractorName).length > 0, "Contractor name required");
        require(_fundAllocated > 0,                "Fund amount must be > 0");

        // Cumulative total for this project
        projectTotalFunds[_projectId] += _fundAllocated;
        uint256 newTotal = projectTotalFunds[_projectId];

        // Warn if total exceeds estimate (doesn't revert — just emit, handle in frontend)
        uint256 estimate = projectEstimates[_projectId];
        if (estimate > 0) {
            require(
                newTotal <= estimate,
                "Total allocated funds exceed project estimate!"
            );
        }

        // Assign record ID
        recordCounter++;
        recordId = recordCounter;

        // Store record
        records[recordId] = FundRecord({
            recordId:         recordId,
            eventName:        _eventName,
            contractorName:   _contractorName,
            projectEstimate:  estimate,
            fundAllocated:    _fundAllocated,
            totalFundTillNow: newTotal,
            timestamp:        block.timestamp,
            recordedBy:       msg.sender,
            remarks:          _remarks,
            exists:           true
        });

        // Link record to project
        projectRecords[_projectId].push(recordId);

        emit FundAllocated(
            recordId,
            _projectId,
            _eventName,
            _contractorName,
            estimate,
            _fundAllocated,
            newTotal,
            block.timestamp,
            msg.sender
        );
    }

    // ─────────────────────────────────────────────
    //  VIEW / QUERY FUNCTIONS
    // ─────────────────────────────────────────────

    /**
     * @dev Get a single fund record by its ID.
     */
    function getRecord(uint256 _recordId)
        external
        view
        returns (FundRecord memory)
    {
        require(records[_recordId].exists, "Record not found");
        return records[_recordId];
    }

    /**
     * @dev Get all record IDs for a project.
     */
    function getProjectRecordIds(string calldata _projectId)
        external
        view
        returns (uint256[] memory)
    {
        return projectRecords[_projectId];
    }

    /**
     * @dev Get full history of all allocations for a project.
     */
    function getProjectHistory(string calldata _projectId)
        external
        view
        returns (FundRecord[] memory)
    {
        uint256[] memory ids = projectRecords[_projectId];
        FundRecord[] memory history = new FundRecord[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            history[i] = records[ids[i]];
        }
        return history;
    }

    /**
     * @dev Get project summary — estimate, total allocated, and remaining budget.
     */
    function getProjectSummary(string calldata _projectId)
        external
        view
        returns (
            uint256 estimate,
            uint256 totalAllocated,
            uint256 remaining,
            uint256 numberOfTransactions
        )
    {
        estimate             = projectEstimates[_projectId];
        totalAllocated       = projectTotalFunds[_projectId];
        remaining            = estimate > totalAllocated ? estimate - totalAllocated : 0;
        numberOfTransactions = projectRecords[_projectId].length;
    }

    /**
     * @dev Verify integrity — returns true if a record's stored total matches
     *      the sum of all individual allocations for that project up to that record.
     *      Useful to prove data hasn't been tampered.
     */
    function verifyProjectIntegrity(string calldata _projectId)
        external
        view
        returns (bool isValid, uint256 computedTotal)
    {
        uint256[] memory ids = projectRecords[_projectId];
        computedTotal = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            computedTotal += records[ids[i]].fundAllocated;
        }
        isValid = (computedTotal == projectTotalFunds[_projectId]);
    }
}
