import {Text, View} from "react-native";
import {StyleSheet} from "react-native";
import {ThemeNames, useTheme} from "@/contexts/ThemeContext";
import {usePageTitle} from "@/contexts/PageTitleContext";
import React, {useEffect} from "react";
import {Logo} from "@/components/Logo";
import Authors from "@/components/Authors";
import {Button, SidebarButtonType} from "@/components/Button";
import Feather from "@expo/vector-icons/Feather";
import {useLoadingScreen} from "@/contexts/LoadingScreenContext";
import {useModal} from "@/contexts/ModalContext";
import {ToS} from "@/components/ToS";

export default function WelcomePage() {
    const {currentTheme, isLightTheme, setTheme} = useTheme()
    const {setTitle: setPageTitle} = usePageTitle()
    const {show, hide} = useLoadingScreen()
    const {openModal, setContent, setTitle, setIsClosable} = useModal()

    useEffect(() => {
        setPageTitle("Yotei")
        setTitle("Terms of Service");
        setContent(<ToS/>);
        setIsClosable(false);
    }, [])

    const handleThemeSwitch = async () => {
        show()
        if (isLightTheme) {
            await setTheme(ThemeNames.DARK)
        } else {
            await setTheme(ThemeNames.LIGHT)
        }
        hide()
    }

    const handleSetup = () => {
        console.log("Setup clicked")
        openModal()
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: currentTheme.style.background,
            alignItems: 'center',
            paddingBottom: 50,
            height: "100%",
            paddingTop: 50,
        },
        textHeaderContainer: {
            marginTop: 1,
        },
        textHeader: {
            color: currentTheme.style.text,
            fontWeight: "bold",
            fontSize: 24,
            textAlign: "center",
        },
        topContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        centerContainer: {
            flex: 1,
            justifyContent: 'center',
            gap: 20,
        },
        bottomContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        text: {
            color: currentTheme.style.text,
            fontSize: 18,
            textAlign: "center",
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Logo height={"150"} width={"150"}></Logo>
                <View style={styles.bottomContainer}>
                    <Text style={styles.textHeader}>Welcome to Yotei</Text>
                </View>

            </View>
            <View style={styles.centerContainer}>
                <View>
                    <Button
                        onClick={handleSetup}
                        title={"Setup"}
                        icon={
                            <Feather name="arrow-right" size={24} color={currentTheme.style.text}/>
                        }>
                    </Button>
                </View>
                <View>
                    <Button
                        title="Change Theme"
                        onClick={handleThemeSwitch}
                        type={SidebarButtonType.SECONDARY}
                        icon={<Feather name={isLightTheme ? "sun" : "moon"} size={24}
                                       color={isLightTheme ? currentTheme.style.text : "white"}/>}
                    />
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.text}>Authors:</Text>
                <Authors/>
            </View>
        </View>
    )
}