// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProjectCounters
 * @dev Simple implementation of a counter that can be incremented, decremented, or reset
 * This replaces the OpenZeppelin Counters.sol dependency
 */
library ProjectCounters {
    struct Counter {
        uint256 _value; // default: 0
    }

    /**
     * @dev Returns the current value of the counter
     */
    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    /**
     * @dev Increments the counter by 1
     */
    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    /**
     * @dev Decrements the counter by 1
     */
    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    /**
     * @dev Resets the counter to zero
     */
    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}