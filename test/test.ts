// Copyright (c) 2020, Brandon Lehmann, The TurtleCoin Developers
//
// Please see the included LICENSE file for more information.

import * as assert from 'assert';
import { after, before, describe, it } from 'mocha';
import { TurtleCoind, WalletAPI, WalletAPIInterfaces, LegacyTurtleCoind } from '../src';

describe('TurtleCoind < 1.0.0', function () {
    this.timeout(60000);

    const server = new LegacyTurtleCoind('seed.turtlenode.io');

    before('check()', async function () {
        try {
            const result = await server.info();

            const [major] = result.version.split('.')
                .map(elem => parseInt(elem, 10));

            if (major > 0) {
                this.skip();
            }
        } catch (e) {
            this.skip();
        }
    });

    it('block({hash}', async () => {
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        const block = await server.block(hash);
        assert(block.hash === hash);
        assert(block.prev_hash === prevHash);
    });

    it('blockCount()', () => {
        return server.blockCount();
    });

    it('blockHeaderByHash({hash})', async () => {
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        const block = await server.blockHeaderByHash(hash);
        assert(block.hash === hash);
        assert(block.prev_hash === prevHash);
    });

    it('blockHeaderByHeight({hash})', async () => {
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        const block = await server.blockHeaderByHeight(0);
        assert(block.hash === hash);
        assert(block.prev_hash === prevHash);
    });

    it('blocksDetailed()', async () => {
        const result = await server.blocksDetailed(undefined, undefined, 1);
        const block = result.blocks[0];
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        assert(block.hash === hash && block.index === 0);
    });

    it('blockShortHeaders()', async () => {
        const result = await server.blockShortHeaders(31);
        assert(result.length === 31);
    });

    it('blocksLite()', async () => {
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        const result = await server.blocksLite([hash]);
        const block = result.items[0];
        assert(block.hash === hash && block.block.length > 0);
    });

    it('blockTemplate()', async () => {
        const wallet = 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn77' +
            '83RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ';
        const reserve = 8;
        const template = await server.blockTemplate(wallet, reserve);
        assert(template.difficulty > 0);
    });

    it('fee()', async () => {
        const fee = await server.fee();
        assert(fee);
    });

    it('globalIndexes()', async () => {
        const hash = 'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909d';
        const result = await server.globalIndexes(hash);
        assert(result.length === 6);
    });

    it('globalIndexesForRange()', async () => {
        const response = await server.globalIndexesForRange(0, 10);

        assert(response.length === 10);
    });

    it('height()', () => {
        return server.height();
    });

    it('info()', () => {
        return server.info();
    });

    it('lastBlockHeader()', async () => {
        const header = await server.lastBlockHeader();
        assert(header.depth === 0);
    });

    it('peers()', () => {
        return server.peers();
    });

    it('poolChanges()', async () => {
        const hash = 'ea531b1af3da7dc71a7f7a304076e74b526655bc2daf83d9b5d69f1bc4555af0';
        const changes = await server.poolChanges(hash, []);
        assert(!changes.isTailBlockActual);
    });

    it('randomOutputs()', async () => {
        const random = await server.randomOutputs([1, 2, 3], 3);
        assert(random.outs.length === 3);
        for (const rnd of random.outs) {
            assert(rnd.outs.length === 3);
        }
    });

    it('rawBlocks()', async () => {
        const result = await server.rawBlocks(
            undefined, undefined, undefined, undefined, 1);
        assert(result.items.length === 1);
        assert(result.items[0].block.length !== 0);
    });

    it('sendRawTransaction()', async () => {
        const txn = '010001026404d48008fff717d2872294b71e51b8304ed711c0fe240a2614610cc0380a5d0b8b13e2652e6c062fbb' +
            '056b7f1f015a027b2288942d52247932af36dc1d722da61f296089015b83d591f5a71afafa948021015af0c037fcfe8' +
            'c50f1e11876c98338fe664c85bc11cd696bc04c988b5669deda96a4299dd9cb471795d079da82e25827badcd79400b3' +
            '94e7c51b67c662d0fc03204a3967aa2bc90708c97cc0370597ad9e154dc7d418ab71b981f8bb805cc603bde2fcb1025' +
            'bb8b7a04e5e5168cebd724c920fcbb3399210543db9cf7ef9440fa0f11f5a2ea908da1f60f359ab2af2f79783b21113' +
            '62260fc8d562b268dd350dcb07941d179f34cfd43a3b8d689db6ff453fce4e987a537a528a80f011217e0460434e52d' +
            'a411e8760b10c34a3b63236eb966273a26a3ad3fc7a863a3b6bc508b16cc7763b28743f4ba5a9711e95eeb95762aa6e' +
            '9c79725170d42fc8968dcd051d2eef49e1726db2fd92e76c47455efff52fc0b473899acaff169316f9654802';

        /* We know this test will fail as this txn is no longer valid */
        return server.sendRawTransaction(txn)
            .then(() => assert(false))
            .catch(() => assert(true));
    });

    it('submitBlock()', async () => {
        const block = '0400850d6b0dcd9aee8adc27ddf2c0102cc7985d006bd7ca057d09313c6afe9f34580000829de8e10500000000' +
            '00000000000000000000000000000000000000000000000000000000000000000100000000230321000000000000000' +
            '000000000000000000000000000000000000000000000000000018ee14501ffe6e045050202e9567859b844305a8c33' +
            'd36d7a31ac29a78b233dc00de39878c77e4b639d23b4f403024f44e842ba4d0aaade34ac03940da2dc6f8ae146f6948' +
            'a8b240db947a661f3c280f104026d11bea76123efc53ab8e233252486c6bfb1cd499823d383a22711405cc6346580ea' +
            '30027b64b9e6c9922387a1343d22c8040ae4a1b787ed7f3bfbeac92ba1b8356175fe80897a023cfa03f1fc506eb7971' +
            '16baa22f4d63425f2137fb9c1e3116f1ab5b6e0a6d54aeb01011f8b6c0e5635716d6446867cdc4dba0006989ec5440e' +
            'f4804a44727bf713a2c702c800000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '0000000000000000000000000000000000000000000002baa8def39990827a71965b84d61be5d7db6a6270428d8e48d' +
            '8eb8015d43f65f0e189e52e3fe9f0da5b04fed64effc070e1b97e32cb5445a4434a70eda8c6572f';

        /* We know this test will fail as this block won't work */
        return server.submitBlock(block)
            .then(() => assert(false))
            .catch(() => assert(true));
    });

    it('transaction()', async () => {
        const hash = 'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909d';
        const txn = await server.transaction(hash);

        const expectedBlock = 'ea531b1af3da7dc71a7f7a304076e74b526655bc2daf83d9b5d69f1bc4555af0';

        assert(txn.block.hash === expectedBlock && txn.txDetails.hash === hash);
    });

    it('transactionPool()', async () => {
        return server.transactionPool();
    });

    it('transactionsStatus()', async () => {
        const status = await server.transactionStatus([
            'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909d',
            'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909c'
        ]);
        assert(status.transactionsUnknown.length === 1 && status.transactionsInBlock.length === 1);
    });

    it('walletSyncData()', async () => {
        const result = await server.walletSyncData(
            undefined, undefined, undefined, undefined, 1);
        assert(result.items.length === 1);
        assert(result.items[0].blockHeight === 0);
    });
});

describe('TurtleCoind >= 1.0.0', function () {
    this.timeout(60000);

    const server = new TurtleCoind('localhost');

    before('check()', async function () {
        try {
            const result = await server.info();

            if (result.version.major < 1) {
                this.skip();
            }
        } catch (e) {
            this.skip();
        }
    });

    it('block({hash})', async () => {
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        const block = await server.block(hash);
        assert(block.hash === hash);
        assert(block.prevHash === prevHash);
    });

    it('block({height})', async () => {
        const hash = '7fb97df81221dd1366051b2d0bc7f49c66c22ac4431d879c895b06d66ef66f4c';
        const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
        const block = await server.block(0);
        assert(block.hash === hash);
        assert(block.prevHash === prevHash);
    });

    it('blockCount()', () => {
        return server.blockCount();
    });

    it('blockHeaders()', async () => {
        const headers = await server.blockHeaders(100);
        assert(headers.length === 31);
    });

    it('blockTemplate()', async () => {
        const wallet = 'TRTLv1pacKFJk9QgSmzk2LJWn14JGmTKzReFLz1RgY3K9Ryn77' +
            '83RDT2TretzfYdck5GMCGzXTuwKfePWQYViNs4avKpnUbrwfQ';
        const reserve = 8;
        const template = await server.blockTemplate(wallet, reserve);
        assert(template.difficulty > 0);
    });

    it('fee()', async () => {
        const fee = await server.fee();

        assert(fee);
    });

    it('indexes()', async () => {
        const indexes = await server.indexes(0, 10);

        assert(indexes.length === 11);
    });

    it('height()', () => {
        return server.height();
    });

    it('info()', () => {
        return server.info();
    });

    it('lastBlock()', async () => {
        const header = await server.lastBlock();
        assert(header.depth === 0);
    });

    it('peers()', () => {
        return server.peers();
    });

    it('transactionPoolChanges()', async () => {
        const hash = 'ea531b1af3da7dc71a7f7a304076e74b526655bc2daf83d9b5d69f1bc4555af0';
        const changes = await server.transactionPoolChanges(hash, []);
        assert(!changes.synced);
    });

    it('randomIndexes()', async () => {
        const random = await server.randomIndexes([1, 2, 3], 3);
        assert(random.length === 3);
        for (const rnd of random) {
            assert(rnd.outputs.length === 3);
        }
    });

    it('rawSync()', async () => {
        const sync = await server.rawSync(
            undefined,
            0,
            undefined,
            true,
            10
        );
        assert(sync.blocks.length === 10);
    });

    it('sendRawTransaction()', async () => {
        const txn = '010001026404d48008fff717d2872294b71e51b8304ed711c0fe240a2614610cc0380a5d0b8b13e2652e6c062fbb' +
            '056b7f1f015a027b2288942d52247932af36dc1d722da61f296089015b83d591f5a71afafa948021015af0c037fcfe8' +
            'c50f1e11876c98338fe664c85bc11cd696bc04c988b5669deda96a4299dd9cb471795d079da82e25827badcd79400b3' +
            '94e7c51b67c662d0fc03204a3967aa2bc90708c97cc0370597ad9e154dc7d418ab71b981f8bb805cc603bde2fcb1025' +
            'bb8b7a04e5e5168cebd724c920fcbb3399210543db9cf7ef9440fa0f11f5a2ea908da1f60f359ab2af2f79783b21113' +
            '62260fc8d562b268dd350dcb07941d179f34cfd43a3b8d689db6ff453fce4e987a537a528a80f011217e0460434e52d' +
            'a411e8760b10c34a3b63236eb966273a26a3ad3fc7a863a3b6bc508b16cc7763b28743f4ba5a9711e95eeb95762aa6e' +
            '9c79725170d42fc8968dcd051d2eef49e1726db2fd92e76c47455efff52fc0b473899acaff169316f9654802';

        /* We know this test will fail as this txn is no longer valid */
        return server.submitTransaction(txn)
            .then(() => assert(false))
            .catch(() => assert(true));
    });

    it('submitBlock()', async () => {
        const block = '0400850d6b0dcd9aee8adc27ddf2c0102cc7985d006bd7ca057d09313c6afe9f34580000829de8e10500000000' +
            '00000000000000000000000000000000000000000000000000000000000000000100000000230321000000000000000' +
            '000000000000000000000000000000000000000000000000000018ee14501ffe6e045050202e9567859b844305a8c33' +
            'd36d7a31ac29a78b233dc00de39878c77e4b639d23b4f403024f44e842ba4d0aaade34ac03940da2dc6f8ae146f6948' +
            'a8b240db947a661f3c280f104026d11bea76123efc53ab8e233252486c6bfb1cd499823d383a22711405cc6346580ea' +
            '30027b64b9e6c9922387a1343d22c8040ae4a1b787ed7f3bfbeac92ba1b8356175fe80897a023cfa03f1fc506eb7971' +
            '16baa22f4d63425f2137fb9c1e3116f1ab5b6e0a6d54aeb01011f8b6c0e5635716d6446867cdc4dba0006989ec5440e' +
            'f4804a44727bf713a2c702c800000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' +
            '0000000000000000000000000000000000000000000002baa8def39990827a71965b84d61be5d7db6a6270428d8e48d' +
            '8eb8015d43f65f0e189e52e3fe9f0da5b04fed64effc070e1b97e32cb5445a4434a70eda8c6572f';

        /* We know this test will fail as this block won't work */
        return server.submitBlock(block)
            .then(() => assert(false))
            .catch(() => assert(true));
    });

    it('transaction()', async () => {
        const hash = 'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909d';
        const txn = await server.transaction(hash);

        const expectedBlock = 'ea531b1af3da7dc71a7f7a304076e74b526655bc2daf83d9b5d69f1bc4555af0';
        const expectedPublicKey = '7d812f35cfff8bc6b5d118944d6476c73495f5c2de3f6a923f3510661646ac9d';

        assert(txn.block.hash === expectedBlock && txn.meta.publicKey === expectedPublicKey);
    });

    it('transactionPool()', () => {
        return server.transactionPool();
    });

    it('transactionStatus()', async () => {
        const status = await server.transactionsStatus([
            'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909d',
            'bdcbc8162dc1949793c1c6d0656ac60a6e5a3c505969b18bdfa10360d1c2909c'
        ]);
        assert(status.notFound.length === 1 && status.inBlock.length === 1);
    });

    it('sync()', async () => {
        const sync = await server.sync();
        assert(sync.blocks.length !== 0 && !sync.synced);
    });
});

describe('WalletAPI', async function () {
    this.timeout(60000);

    const randomFilename = () => (Math.random() * 100000000).toString() + '.wallet';

    const newFilename = randomFilename();
    const password = 'password';

    const server = new WalletAPI(process.env.WALLETAPI_PASSWORD || 'password');

    describe('New Wallet', () => {
        let skipped = false;

        before('create()', async function () {
            try {
                await server.status();
            } catch (e) {
                skipped = true;
                this.skip();
            }

            return await server.create(newFilename, password);
        });

        after('close()', async function () {
            if (!skipped) {
                return server.close();
            }
        });

        it('addresses()', async () => {
            const response = await server.addresses();
            assert(response.length === 1);
        });

        it('balance()', async () => {
            const response = await server.balance();
            assert(response.unlocked === 0 && response.locked === 0);
        });

        it('balance(address)', async () => {
            const response = await server.addresses();
            const res = await server.balance(response[0]);
            assert(res.unlocked === 0 && res.locked === 0);
        });

        it('balances()', async () => {
            const response = await server.balances();
            assert(response.length === 1);
        });

        it('createAddress()', async () => {
            return server.createAddress();
        });

        it('createIntegratedAddress()', async () => {
            const address = 'TRTLuwuGiuyWSkTTKQy8jGj4Dfr5typGJFoaHKzKGdu79S79x1Mk5biMnWUFXRtr9K' +
                'FmDAQxUuh9j3WretzXaZzGVPyzRQSM8Wu';
            const paymentId = '1DE6276D400098659A6B065D6422959FB15C83A260D32E59095987E91FF01B05';
            const response = await server.createIntegratedAddress(address, paymentId);

            const expected = 'TRTLuxjg8MT9Q9z9a1oMTmAa6thQCcjQV94iS9Cmu3tVAZzKnMkf5iAAQDKkcBhon' +
                'A9QgkMdUZe6tAQN9gQUkhqh9EsSQLNDoX9WSkTTKQy8jGj4Dfr5typGJFoaHKzKGdu79S79x1Mk5biMn' +
                'WUFXRtr9KFmDAQxUuh9j3WretzXaZzGVPyzRUXFtwc';

            assert(response === expected);
        });

        it('deleteAddress()', async () => {
            const wallet = await server.createAddress();
            if (wallet.address) {
                return server.deleteAddress(wallet.address);
            }
        });

        it.skip('deletePreparedTransaction()');

        it('getNode()', async () => {
            const response = await server.getNode();
            assert(response.daemonHost && response.daemonPort);
        });

        it('importAddress()', async () => {
            return server.importAddress(
                'c1493e663cec48cb1db70fc6bb3e04be1eec99f398f5a7c343aa67f159419e09');
        });

        it('importDeterministic()', async () => {
            return server.importDeterministic(5);
        });

        it('keys()', async () => {
            return server.keys();
        });

        it('keys(address)', async () => {
            const address = await server.primaryAddress();
            const res = await server.keys(address) as WalletAPIInterfaces.IWallet;
            assert(res.privateSpendKey && res.publicSpendKey);
        });

        it('keysMnemonic()', async () => {
            const address = await server.primaryAddress();
            const mnemonic = await server.keysMnemonic(address);
            assert(mnemonic.length !== 0);
        });

        it('newDestination()', () => {
            const dst = server.newDestination(
                'TRTLuwuGiuyWSkTTKQy8jGj4Dfr5typGJFoaHKzKGdu79S79x1Mk5biMnWUFXRtr9KFmDAQxUuh9j3WretzXaZzGVPyzRQSM8Wu',
                1.15
            );
            assert(dst.amount === 115);
        });

        it.skip('prepareAdvanced()');

        it.skip('prepareBasic()');

        it('primaryAddress()', async () => {
            return server.primaryAddress();
        });

        it('reset()', async () => {
            return server.reset();
        });

        it('save()', async () => {
            return server.save();
        });

        it.skip('sendAdvanced()');

        it.skip('sendBasic()');

        it.skip('sendFusionAdvanced()');

        it.skip('sendFusionBasic()');

        it.skip('sendPrepared()');

        it('setNode()', async () => {
            return server.setNode('localhost', 11898);
        });

        it('status', async () => {
            const response = await server.status();
            assert(!response.isViewWallet && response.peerCount);
        });

        it.skip('transactionByHash()');

        it.skip('transactionPrivateKey()');

        it('transactions()', async () => {
            const response = await server.transactions();
            assert(response.length === 0);
        });

        it('transactionsByAddress()', async () => {
            const address = await server.primaryAddress();
            const response = await server.transactionsByAddress(address);
            assert(response.length === 0);
        });

        it('unconfirmedTransactions()', async () => {
            const response = await server.unconfirmedTransactions();
            assert(response.length === 0);
        });

        it('unconfirmedTransactions(address)', async () => {
            const address = await server.primaryAddress();
            const response = await server.unconfirmedTransactions(address);
            assert(response.length === 0);
        });

        it('validateAddress()', async () => {
            const address = 'TRTLuxQ2jXVeGrQNKFgAvGc4GifYEcrLC8UWEebLMjfNDt7JXZhAyzChdAthLTZHWYPKRgeimfJqzHBmv' +
                'hwUzYgPAHML6SRXjoz';
            const response = await server.validateAddress(address);
            assert(response.actualAddress === address);
        });

        it('fail validateAddress()', async () => {
            const address = 'TRTLuxQ2jXVeGrQNKFgAvGc4GifYEcrLC8UWEebLMjfNDt7JXZhAyzChdAthLTZHWYPKRgeimfJqzHBmv' +
                'hwUzYgPAHML6SRXjoq';

            /* We expect this test to fail as this address is invalid */
            return server.validateAddress(address)
                .then(() => assert(false))
                .catch(() => assert(true));
        });
    });

    describe('Import Wallet', () => {
        describe('By Keys', () => {
            let skipped = false;

            before('check', async function () {
                try {
                    await server.status();
                } catch (e) {
                    skipped = true;
                    this.skip();
                }
            });

            after('close()', async function () {
                if (!skipped) {
                    return server.close();
                }
            });

            it('importKey()', async () => {
                return server.importKey(
                    randomFilename(),
                    password,
                    '84271126f661ae8cdb06de981d69fd7fc7b14aaa9af53766440836b5c52da900',
                    'dd8d88c0d391db824190fc83dfb516d35ea1d7ec8ce0e7b6bf48566fcc7d1a0f'
                );
            });
        });

        describe('By Seed', () => {
            let skipped = false;

            before('check', async function () {
                try {
                    await server.status();
                } catch (e) {
                    skipped = true;
                    this.skip();
                }
            });

            after('close()', async function () {
                if (!skipped) {
                    return server.close();
                }
            });

            it('importSeed()', async () => {
                return server.importSeed(
                    randomFilename(),
                    password,
                    'five aphid spiders obnoxious wolf library love anxiety nephew mumble apex tufts ' +
                    'ladder hyper gasp hobby android segments sneeze flying royal betting vixen abnormal obnoxious'
                );
            });
        });

        describe('View Only', () => {
            let skipped = false;

            before('check', async function () {
                try {
                    await server.status();
                } catch (e) {
                    skipped = true;
                    this.skip();
                }
            });

            after('close()', async function () {
                if (!skipped) {
                    return server.close();
                }
            });

            it('importViewOnly', async () => {
                return server.importViewOnly(
                    randomFilename(),
                    password,
                    '84271126f661ae8cdb06de981d69fd7fc7b14aaa9af53766440836b5c52da900',
                    'TRTLuxQ2jXVeGrQNKFgAvGc4GifYEcrLC8UWEebLMjfNDt7JXZhAyzChdAthLTZHWYPKRgeimfJqzHBmvhwUzYgPAHML6SRXjoz'
                );
            });

            it('importViewAddress()', async () => {
                return server.importViewAddress(
                    'adda22257c435d09697d6ffe5841f4e70a32900a0f08e69f75875761a9c524f6');
            });
        });
    });

    describe('Open Wallet', () => {
        let skipped = false;

        before('check', async function () {
            try {
                await server.status();
            } catch (e) {
                skipped = true;
                this.skip();
            }
        });

        after('close()', async function () {
            if (!skipped) {
                return server.close();
            }
        });

        it('open()', async () => {
            return server.open(newFilename, password);
        });
    });
});
