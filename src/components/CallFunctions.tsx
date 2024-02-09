"use client"

import { Alert, Button, Card, Flex, Form, Input, Select, Typography } from "antd"
import { useForm } from "antd/es/form/Form"
import { useWeb3Modal, useWeb3ModalEvents, useWeb3ModalState } from '@web3modal/wagmi1/react';
import React from "react";
import { useContractWrite } from "wagmi";
import { SeekSolutionContractService } from "@/utils/web3/SeekSolutionContractService";
import { CopyOutlined } from "@ant-design/icons";
import { GlobalContext } from "@/context/Provider";
import { DefaultOptionType } from "antd/es/select";

const CallFunctions = () => {
    const { Toast } = React.useContext(GlobalContext)
    const [form] = useForm()
    const [hash, setHash] = React.useState<string>("")
    const [loading, setLoading] = React.useState(false)

    const handleFunctionCall = async ({ privateKey, rpcName, infuraKey, contractAddress, contractAbi, functionName, params }: {
        privateKey: string,
        rpcName: string,
        infuraKey: string,
        contractAddress: string,
        functionName: string,
        params: string,
        contractAbi: Array<any>
    }) => {
        try {
            setLoading(true)
            const contractService = new SeekSolutionContractService(privateKey, rpcName, infuraKey)
            const { contract } = contractService.marketplaceContract(contractAddress, contractAbi)
            const result = await contractService.createWallet(functionName, params.split(","), contract)
            setHash(result)
        } catch (error) {
            Toast.error(JSON.stringify(error))
            console.log("eror", error);

        } finally {
            setLoading(false)
        }
    }
    const handleClipboard = () => {
        navigator.clipboard.writeText(hash)
        Toast.success("Copied")
    }

    // const getFunctions = () => {
    //     const newArr: Array<DefaultOptionType> = []
    //     const arr = JSON.parse(correctedJsonString(form.getFieldValue("contractAbi")))
    //     const filter = arr.filter((fil: any) => fil.name = "function")
    //     filter.forEach((element: any) => {
    //         newArr.push({ value: element.name, label: element.name })
    //     });
    //     return newArr
    // }
    const correctedJsonString = (originalJsonString: string) => {
        if (!originalJsonString) {
            return '[]'
        }
        return originalJsonString?.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
    }


    return <Flex vertical gap={"large"}>
        {hash &&
            <Alert
                message={hash}
                type="success"
                showIcon
                action={
                    <CopyOutlined onClick={handleClipboard} />
                }
                closable
            />}
        <Card
            title="Contract testing"
            style={{ width: "100%" }}
            extra={
                <w3m-button />
            }>
            <Form
                layout="vertical"
                form={form}
                initialValues={{
                    contractAbi: '[]'
                }}
                onFinish={handleFunctionCall}
            >

                <Form.Item
                    name="privateKey"
                    label="Private key"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="rpcName"
                    label="RPC Name"
                >
                    <Select
                        defaultValue={"mainnet"}
                        showSearch
                        options={[
                            { value: 'mainnet', label: 'Mainnet' },
                            { value: 'goerli', label: 'Goerli' },
                            { value: 'sepolia', label: 'Sepolia' },
                            { value: 'polygon-mainnet', label: 'Polygon Mainnet' },
                            { value: 'polygon-mumbai', label: 'Polygon Mumbai' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name="infuraKey"
                    label="Infura Key"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="contractAddress"
                    label="Contract Address"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="contractAbi"
                    label="Contract abi"
                >
                    <Input.TextArea rows={10} />
                </Form.Item>
                <Form.Item
                    noStyle
                    label="Function Name"
                    dependencies={['contractAbi']}
                >
                    {() => (
                        <Form.Item
                            name="functionName"
                            label="Function Name"
                            dependencies={['contractAbi']}
                        >
                            <Select
                                placeholder="Select function"
                                showSearch
                                options={(JSON.parse(correctedJsonString(form.getFieldValue("contractAbi")))
                                    .filter((fil: any) => fil.type = "function"))
                                    .map((element: any) => ({ value: element.name, label: element.name }))
                                }
                            />
                        </Form.Item>
                    )}

                </Form.Item>
                <Form.Item
                    name="params"
                    label="Params"
                >
                    <Input />
                </Form.Item>

                <Button type="primary" size="large" htmlType="submit" block>Exicute</Button>

            </Form>
        </Card>
    </Flex>

}

export default CallFunctions