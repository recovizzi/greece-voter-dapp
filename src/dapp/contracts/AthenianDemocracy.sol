// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AthenianDemocracy {
    struct Proposal {
        string ipfsHash;
        string description;
        address proposer;
        uint256 approvals;
        uint256 rejections;
        uint256 timestamp;
        bool finalized;
        bool passed;
    }
    mapping(uint256 => Proposal) public proposals;

    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public proposalCount;

    function proposeLaw(string memory _description, string memory _ipfsHash) public {
        require(bytes(_description).length > 0, "");
        require(bytes(_ipfsHash).length > 0, "");

        Proposal memory newProposal = Proposal(_ipfsHash, _description, msg.sender, 0, 0, block.timestamp, false, false);
        proposalCount++;
        proposals[proposalCount] = newProposal;
     }

    function vote(uint256 _proposalId, bool _approve) public {
        if(block.timestamp - proposals[_proposalId].timestamp >= 3 minutes){
            finalizeProposal(_proposalId);
        }
        else{
            require((!proposals[_proposalId].finalized) && (hasVoted[_proposalId][msg.sender] == false), "Vote cannot be send." );
            hasVoted[_proposalId][msg.sender] = true;
            if (_approve){
            proposals[_proposalId].approvals++;
            }else {
            proposals[_proposalId].rejections++;
            }
        }
     }

    function finalizeProposal(uint256 _proposalId) public {
        require((!proposals[_proposalId].finalized) && (block.timestamp - proposals[_proposalId].timestamp >= 3 minutes) , "Vote was not finish or already finish." );
        proposals[_proposalId].finalized = true;
        if (proposals[_proposalId].approvals>proposals[_proposalId].rejections){
            proposals[_proposalId].passed = true;
        }
     }
}