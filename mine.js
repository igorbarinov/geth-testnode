/* global web3 */
(function gethdev() {
  var minHeight = 0;

  // minimum etherbase balance we should mine
  var MIN_BALANCE = web3.toWei(web3.toBigNumber(100), 'ether');

  // number of threads to mine with
  var THREADS = 1;

  // number of blocks to mine on top of new transactions before stopping
  var CONFIRMATIONS = 5;

  function log(str) {
    console.log('[gethdev] ' + str);
  }

  /**
   * Start the miner if it is not already running
   */
  function startMiner() {
    if (!web3.eth.mining) {
      log('Starting miner');
      web3.miner.start(THREADS);
    }
  }

  /**
   * Stop the miner if it is running
   */
  function stopMiner() {
    if (web3.eth.mining) {
      log('Stopping miner');
      web3.miner.stop();
    }
  }

  /**
   * Start or stop the miner if necessary
   */
  function checkStatus() {
    // if etherbase balance is too low, start mining
    if (web3.eth.getBalance(web3.eth.coinbase).lessThan(MIN_BALANCE)) {
      startMiner();
      return;
    }

    // if there are any pending transactions, start mining
    if (web3.eth.getBlock('pending').transactions.length > 0) {
      minHeight = web3.eth.blockNumber + CONFIRMATIONS;

      startMiner();
      return;
    }

    if (web3.eth.blockNumber > minHeight) {
      // nothing to do, pause mining for now
      stopMiner();
    }
  }

  // create the first account (with blank password) if necessary
  if (!web3.eth.coinbase) {
    log('Creating etherbase account');
    web3.personal.newAccount('');
  }

  web3.eth.filter('latest', checkStatus);
  web3.eth.filter('pending', checkStatus);
  startMiner();
}());


// // Adapted from Iuri Matias' Embark framework
// // https://github.com/iurimatias/embark-framework
// // Modified by ryepdx to mine at regular intervals.
// (function() {
//   var main = function () {
//     if (!loadScript("config.js")) {
//       console.log("== config.js not found");
//     }

//     if (typeof(config) === "undefined") {
//       config = {};
//       console.log("== config is undefined, proceeding with defaults");
//     }

//     defaults = {
//       interval_ms: 15000,
//       mine_pending_txns: true,
//       mine_periodically: false,
//       mine_normally: false,
//       threads: 1
//     }

//     for (key in defaults) {
//       if (config[key] === undefined) {
//         config[key] = defaults[key];
//       }
//     }

//     var miner_obj = (admin.miner === undefined) ? miner : admin.miner;

//     if (config.mine_normally) {
//         miner_obj.start(config.threads);
//         return;
//     }
//     miner_obj.stop();

//     if (config.mine_periodically) start_periodic_mining(config, miner_obj);
//     if (config.mine_pending_txns) start_transaction_mining(config, miner_obj);
//   };

//   var pendingTransactions = function() {
//     if (web3.eth.pendingTransactions === undefined || web3.eth.pendingTransactions === null) {
//       return txpool.status.pending || txpool.status.queued;
//     }
//     else if (typeof web3.eth.pendingTransactions === "function")  {
//       return web3.eth.pendingTransactions().length > 0;
//     }
//     else {
//       return web3.eth.pendingTransactions.length > 0 || web3.eth.getBlock('pending').transactions.length > 0;
//     }
//   };

//   var start_periodic_mining = function (config, miner_obj) {
//     var last_mined_ms = Date.now();
//     var timeout_set = false;

//     miner_obj.start(config.threads);
//     web3.eth.filter("latest").watch(function () {
//       if ((config.mine_pending_txns && pendingTransactions()) || timeout_set) {
//         return;
//       }

//       timeout_set = true;

//       var now = Date.now();
//       var ms_since_block = now - last_mined_ms;
//       last_mined_ms = now;

//       var next_block_in_ms;

//       if (ms_since_block > config.interval_ms) {
//         next_block_in_ms = 0;
//       } else {
//         next_block_in_ms = (config.interval_ms - ms_since_block);
//       }

//       miner_obj.stop();
//       console.log("== Looking for next block in " + next_block_in_ms + "ms");

//       setTimeout(function () {
//         console.log("== Looking for next block");
//         timeout_set = false;
//         miner_obj.start(config.threads);
//       }, next_block_in_ms);
//     });
//   };

//   var start_transaction_mining = function (config, miner_obj) {
//     web3.eth.filter("pending").watch(function () {
//       if (miner_obj.hashrate > 0) return;

//       console.log("== Pending transactions! Looking for next block...");
//       miner_obj.start(config.threads);
//     });

//     if (config.mine_periodically) return;

//     web3.eth.filter("latest").watch(function () {
//       if (!pendingTransactions()) {
//         console.log("== No transactions left. Stopping miner...");
//         miner_obj.stop();
//       }
//     });
//   };

//   main();
// })();