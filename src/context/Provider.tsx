"use client";
import React, {
  createContext,
  Fragment,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { ConfigProvider, Layout, message, theme, Tour } from "antd";
import { Web3Modal } from "@/utils/web3/Web3Modal";

type ToastFunction = (msg: any) => void;

interface CommonContextType {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  Toast: {
    error: ToastFunction;
    success: ToastFunction;
    warning: ToastFunction;
  };
}
export const GlobalContext = createContext({} as CommonContextType);
type GlobleContextProviderProps = {
  children: ReactNode;
  theme?: {
    direction: string;
    colorPrimary: string;
  };
};

const { defaultAlgorithm, darkAlgorithm } = theme;
function GlobalProvider(props: GlobleContextProviderProps) {
  const [loading, setLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const success = (success: any) => {
    messageApi.open({
      type: "success",
      content: success,
    });
  };

  const error = (error: any) => {
    let errorBody = error?.response?.body;
    let message = errorBody?.message;
    let error_message = errorBody?.error_description;
    messageApi.open({
      type: "error",
      content: message
        ? message
        : typeof error_message == "string"
          ? error_message
          : error_message
            ? JSON.stringify(error_message)
            : JSON.stringify(error),
      duration: 3,
    });
    setTimeout(messageApi.destroy, 1000);
  };

  const warning = (warning: any) => {
    messageApi.open({
      type: "warning",
      content: warning,
    });
  };

  const Toast = {
    success,
    warning,
    error,
  };

  return (
    <Web3Modal>
      <GlobalContext.Provider
        value={{ ...props, loading, setLoading, Toast } as any}
      >
        <Layout>
          <ConfigProvider
            // direction={locale == ar_EG ? 'rtl' : 'ltr'}
            // locale={locale}

            theme={{
              algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
              // token: {
              //   colorPrimary: colorPrimary,
              //   fontFamily: montserrat.style.fontFamily,
              // },
              components: {

              },
            }}
          >
            {props.children}
            {contextHolder}
          </ConfigProvider>
        </Layout>
      </GlobalContext.Provider>
    </Web3Modal>

  );
}

export default GlobalProvider;
