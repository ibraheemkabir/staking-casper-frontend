import { FTypo, FGrid, FTable, FHeader, FButton } from "ferrum-design-system";
import { useEffect } from "react";
import Datatable from "react-bs-datatable";
import { useDispatch, useSelector } from "react-redux";
import { crucibleApi } from "../client";
import { fetchWithdrawals } from "../redux/casper/casperActions";
import { Networks } from "../utils/stringUtils";
import { CasperWithdrawal } from "../pages/CasperWithdrawal";

import './layout.scss';
import { Web3Helper } from "../utils/web3Helper";
import { MetaMaskConnector } from "./connector";
import { ConnectWalletDialog } from "../utils/connect-wallet/ConnectWalletDialog";

export const Withdrawals = () => {
    const { connect: { config, selectedAccount, isWalletConnected, withdrawalItems } } = useSelector((state: any) => state.casper);
    const { walletAddress, isConnected, networkClient } = useSelector((state: any) => state.casper.walletConnector);

    const dispatch = useDispatch();

    async function withdrawEvm(id: string):Promise<any>{
        const Api = new crucibleApi()
        await Api.signInToServer(walletAddress)
            const res = await Api.gatewayApi({
                command: 'swapGetTransaction', data: {
                  id,
                  amount: 1,
                  targetCurrency: `CSPR:222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473`,
                  currency: 'BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179'
              },
                params: [] });
        if (res.data.requests) {
          const helper = new Web3Helper(networkClient)
          const tx = await helper.sendTransactionAsync(
            dispatch,
            res.data.requests
          )
          console.log(tx);
        }
        console.log(res)
    }    

    const fetchEvmWithdrawalItems = async () => {
        const Api = new crucibleApi()
        await Api.signInToServer(`CSPR:${selectedAccount?.address}`)
        const userWithdrawals = await Api.gatewayApi({
            command: 'getUserNonEvmWithdrawItems', data: {
            userAddress: `CSPR:${selectedAccount?.address}`,
            network: '56',
            receiveAddress: walletAddress,
        }, params: [] });
        if (userWithdrawals.data){
            console.log(userWithdrawals.data,'userWithdrawals.data')
            await fetchWithdrawals(userWithdrawals.data.withdrawableBalanceItems)(dispatch);
        }
        console.log(userWithdrawals, 'userWithdrawals');
    }

    console.log(withdrawalItems, 'userWithdrawals');

    useEffect(() => {
       fetchEvmWithdrawalItems()
    }, [selectedAccount, walletAddress]);

    const tableHeads: any[] = [
        { width: 200, prop: "sourceNetwork", title: "Source Network" },
        { prop: "targetNetwork", title: "Target Network" },
        { prop: "amount", title: "Amount" },
        { prop: "action", title: "Action" }
    ];

    console.log(withdrawalItems)

    const body = (withdrawalItems || []).map((item: any) => { 
        return {
          amount: <FTypo className={"col-amount"}>{item.sendAmount}</FTypo>,
          sourceNetwork: <FTypo className={"col-amount"}>{
            //@ts-ignore
            Networks[item.sendNetwork] || item.receiveNetwork
        }</FTypo>,
          targetNetwork: <FTypo className={"col-amount"}>{
            //@ts-ignore
            Networks[item.receiveNetwork] || item.receiveNetwork
        }</FTypo>,
          action: (
            <div className="col-action">
            {
                isConnected
                ? (<FButton title={"Withdraw"} onClick={() => withdrawEvm(item.id)} />)
                : (
                    <MetaMaskConnector.WalletConnector
                      WalletConnectView={FButton}
                      WalletConnectModal={ConnectWalletDialog}
                      isAuthenticationNeeded={false}
                      WalletConnectViewProps={{ className: "w-100" }}
                    />
                )
            }
            </div>
          ),
        }; 
    }); 

    return (
        <>
            <CasperWithdrawal />
            <FGrid alignX={"center"} className="f-mb-1 withdrawals_container">
                <FTypo size={18} align={"center"} className={"f-mb-14 f-mt--7"}>
                    EVM WITHDRAWALS
                </FTypo>
                <FTable>
                    <Datatable tableBody={body || []} tableHeaders={tableHeads} rowsPerPage={10} />
                </FTable>
            </FGrid>
        </>
    )
}