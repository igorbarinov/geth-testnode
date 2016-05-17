#run

geth --datadir="/tmp/ethlocal"  \
--port 30303 --rpc --rpcport 8101 --rpcaddr localhost \
--networkid 20340 --rpccorsdomain "*" --minerthreads "1" \
--rpcapi "eth,web3" --maxpeers 4 --password password \
--unlock 394ccf6bb5c70921efd5e84b30d2b60f3cf4a0d6 \
js "/Users/bis/code/3/mine.js"


