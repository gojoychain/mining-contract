module.exports = Object.freeze({
  abi: [
    {
      "constant": true,
      "inputs": [],
      "name": "withdrawInterval",
      "outputs": [
        {
          "name": "interval",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [
        {
          "name": "success",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "withdrawAmount",
      "outputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "lastWithdrawBlock",
      "outputs": [
        {
          "name": "lastBlock",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdrawal",
      "type": "event"
    }
  ],
  bytecode: '0x608060405234801561001057600080fd5b506040516020806106568339810180604052602081101561003057600080fd5b505160038054600160a060020a031916600160a060020a0380841691909117918290556040518392909116906000907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35080600160a060020a03811615156100fd57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f52657175697265732076616c696420616464726573732e000000000000000000604482015290519081900360640190fd5b505069261dd1ce2f208880000060005561708060015543600255610530806101266000396000f3fe608060405260043610610098576000357c0100000000000000000000000000000000000000000000000000000000900480638da5cb5b1161006b5780638da5cb5b146101145780638f32d59b146101455780639e0796d01461015a578063f2fde38b1461016f57610098565b8063162075d81461009a5780633ccfd60b146100c1578063534844a2146100ea578063715018a6146100ff575b005b3480156100a657600080fd5b506100af6101a2565b60408051918252519081900360200190f35b3480156100cd57600080fd5b506100d66101a8565b604080519115158252519081900360200190f35b3480156100f657600080fd5b506100af6102ac565b34801561010b57600080fd5b506100986102b2565b34801561012057600080fd5b50610129610351565b60408051600160a060020a039092168252519081900360200190f35b34801561015157600080fd5b506100d6610360565b34801561016657600080fd5b506100af610371565b34801561017b57600080fd5b506100986004803603602081101561019257600080fd5b5035600160a060020a0316610377565b60015490565b60006101b2610360565b15156101f25760405160e560020a62461bcd02815260040180806020018281038252602a8152602001806104db602a913960400191505060405180910390fd5b6001546002544303101561023a5760405160e560020a62461bcd0281526004018080602001828103825260438152602001806104986043913960600191505060405180910390fd5b4360025560008054604051339282156108fc02929190818181858888f1935050505015801561026d573d6000803e3d6000fd5b50600054604080519182525133917f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65919081900360200190a250600190565b60005490565b6102ba610360565b15156102fa5760405160e560020a62461bcd02815260040180806020018281038252602a8152602001806104db602a913960400191505060405180910390fd5b600354604051600091600160a060020a0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a36003805473ffffffffffffffffffffffffffffffffffffffff19169055565b600354600160a060020a031690565b600354600160a060020a0316331490565b60025490565b61037f610360565b15156103bf5760405160e560020a62461bcd02815260040180806020018281038252602a8152602001806104db602a913960400191505060405180910390fd5b600160a060020a03811615156104095760405160e560020a62461bcd0281526004018080602001828103825260258152602001806104736025913960400191505060405180910390fd5b600354604051600160a060020a038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a36003805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a039290921691909117905556fe52657175697265732076616c6964206164647265737320666f72206e6577206f776e65722e426c6f636b732066726f6d206c617374207769746864726177616c206e6f742067726561746572207468616e2074686520776974686472617720696e74657276616c2e4f776e6572206973206f6e6c7920616c6c6f77656420746f2063616c6c2074686973206d6574686f642ea165627a7a7230582052d8517a852c889138a359b6442ef93a39eb3aa8883ca0de164c53863a9eea030029',
})
