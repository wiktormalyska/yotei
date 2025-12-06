import {ScrollView, StyleSheet, View} from "react-native";
import React from "react";
import Markdown from 'react-native-markdown-display';
import {useTheme} from "@/contexts/ThemeContext";
import {Button, SidebarButtonType} from "@/components/Button";
import {useLoadingScreen} from "@/contexts/LoadingScreenContext";
import {useModal} from "@/contexts/ModalContext";
import {usePrivacyPolicy} from "@/hooks/use-privacy-policy";
import {useRouter} from "expo-router";

export const PrivacyPolicy = () => {
    const {currentTheme} = useTheme();
    const {setIsPrivacyPolicyConfirmed} = usePrivacyPolicy()
    const {show, hide} = useLoadingScreen()
    const {closeModal} = useModal();
    const router = useRouter()

    const handleAccept = async () => {
        show()
        await setIsPrivacyPolicyConfirmed(true);
        closeModal();
        router.replace('/loginPage');
        hide()
    }

    const privacyContent = `
# Privacy Policy
*Last updated: December 06, 2025*

## 1. Introduction
This Privacy Policy describes how Wiktor Małyska ("we," "us," or "our") manages data when you use the "Yotei" mobile application ("App").

## 2. No Data Collection by Developer
We operate on a strict **"client-side only"** basis to ensure your privacy and security.
* **We do not possess or operate servers for this App.**
* **We do not collect usage analytics.**
* **We do not see, store, process, or transmit your login credentials or schedule data to ourselves or any third parties.**

## 3. Local Data Storage & Direct Communication
All sensitive data (including student ID numbers, passwords, and schedule information) is:
1.  Stored **exclusively locally on your device**.
2.  Transmitted **directly** from your device to PJATK's official servers to authenticate and retrieve data.

This process is technically identical to logging into the university website via a standard web browser. The App acts merely as a specialized interface to visualize this data.

## 4. Interaction with External Services
Since the App functions as a user-agent for PJATK services, your interactions are subject to the privacy practices of the Polsko-Japońska Akademia Technik Komputerowych. Your device's IP address and login requests are visible to PJATK servers, just as they would be if you used a web browser.

## 5. Data Security
Because we do not host your data, its security depends primarily on:
* The physical security of your specific mobile device (screen locks, biometrics).
* The security of your operating system (keeping Android/iOS updated).
* The strength of your network connection (avoiding insecure public Wi-Fi when logging in).

## 6. Children's Privacy
Our App is not intended for individuals under the age of 13. We do not knowingly collect personal data from children.

## 7. Changes to This Policy
We may update our Privacy Policy. Any changes will be posted within the Application and will take effect immediately upon posting.

## 8. Contact
If you have any questions about this Privacy Policy, please contact us at: wiktormalyska03@gmail.com
    `;

    // Spójne style markdown z komponentem ToS
    const markdownStyles = {
        body: {
            fontSize: 16,
            lineHeight: 24,
            color: currentTheme.style.textSecondary,
        },
        heading1: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            marginTop: 0,
            color: currentTheme.style.text,
        },
        heading2: {
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 20,
            marginBottom: 10,
            color: currentTheme.style.text,
        },
        strong: {
            fontWeight: 'bold',
            color: currentTheme.style.text,
        },
        em: {
            fontStyle: 'italic',
            color: currentTheme.style.textSecondary,
        },
        paragraph: {
            marginBottom: 12,
        },
        list_item: {
            marginBottom: 8,
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        layout: {
            flex: 1,
            gap: 20
        }
    });

    return (
        <View style={styles.layout}>
            <ScrollView style={styles.container}>
                <Markdown style={markdownStyles}>
                    {privacyContent}
                </Markdown>
            </ScrollView>
            <Button
                onClick={handleAccept}
                title={"Click to accept Privacy Policy"}
                type={SidebarButtonType.SECONDARY}
            />
        </View>
    )
}