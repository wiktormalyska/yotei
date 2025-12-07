import {StatusBar} from 'react-native';
import {Stack, useRouter} from 'expo-router';
import 'react-native-reanimated';
import '../global.css';
import React, {useEffect} from "react";
import {Header} from "@/components/Header";
import {useTheme, ThemeProvider} from "@/contexts/ThemeContext";
import {useSlideMenu} from "@/components/SlidingMenu";
import {LoadingScreenProvider} from "@/contexts/LoadingScreenContext";
import {AuthContextProvider, useAuthContext} from "@/contexts/AuthContext";
import {PageTitleProvider} from "@/contexts/PageTitleContext";
import {useTos} from "@/hooks/use-tos";
import {ModalProvider} from "@/contexts/ModalContext";
import Modal from "@/components/Modal";
import {usePrivacyPolicy} from "@/hooks/use-privacy-policy";
import {ScheduleDataProvider} from "@/contexts/ScheduleDataContext";
import {ScheduleResponseCacheContextProvider} from "@/contexts/ScheduleResponseCacheContext";

const AppContent = () => {
    const {currentTheme, isLightTheme} = useTheme();
    const {openMenu, closeMenu, isOpen, render: renderSlideMenu} = useSlideMenu();
    const {isAuthenticated} = useAuthContext();
    const {isTosConfirmed} = useTos();
    const {isPrivacyPolicyConfirmed} = usePrivacyPolicy();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isTosConfirmed || !isPrivacyPolicyConfirmed) {
                router.replace('/welcomePage');
            } else if (!isAuthenticated) {
                router.replace('/loginPage');
            } else {
                router.replace('/home');
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [isTosConfirmed, isPrivacyPolicyConfirmed, isAuthenticated]);

    return (
        <>
            <StatusBar
                barStyle={isLightTheme ? "dark-content" : "light-content"}
                backgroundColor={currentTheme.style.background}
            />
            <Modal/>
            <Header openMenu={() => openMenu()} closeMenu={() => closeMenu()} isMenuOpen={isOpen}/>
            {renderSlideMenu({
                children: (
                    <Stack screenOptions={{headerShown: false}}>
                        <Stack.Screen name="home"/>
                        <Stack.Screen name="about"/>
                        <Stack.Screen name="loginPage"/>
                        <Stack.Screen name="welcomePage"/>
                    </Stack>
                )
            })}
        </>
    );
};


export default function RootLayout() {
    return (
        <ThemeProvider>
            <ScheduleResponseCacheContextProvider>
                <ScheduleDataProvider>
                    <LoadingScreenProvider>
                        <ModalProvider>
                            <PageTitleProvider>
                                <AuthContextProvider>

                                    <AppContent/>
                                </AuthContextProvider>
                            </PageTitleProvider>
                        </ModalProvider>
                    </LoadingScreenProvider>
                </ScheduleDataProvider>
            </ScheduleResponseCacheContextProvider>
        </ThemeProvider>
    );
}