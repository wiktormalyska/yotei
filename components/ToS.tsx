import {ScrollView, StyleSheet, View} from "react-native";
import React from "react";
import Markdown from 'react-native-markdown-display';
import {useTheme} from "@/contexts/ThemeContext";
import {Button, SidebarButtonType} from "@/components/Button";
import {useTos} from "@/hooks/use-tos";
import {useLoadingScreen} from "@/contexts/LoadingScreenContext";
import {useModal} from "@/contexts/ModalContext";
import {PrivacyPolicy} from "@/components/PrivacyPolicy";

export const ToS = () => {
    const {currentTheme} = useTheme();
    const {setIsTosConfirmed, getIsTosConfirmed} = useTos()
    const {show, hide} = useLoadingScreen()
    const {setTitle, setContent} = useModal();

    const handleAccept = async () => {
        show()
        console.log(await getIsTosConfirmed());
        await setIsTosConfirmed(true);
        console.log(await getIsTosConfirmed());
        setTitle("Privacy Policy");
        setContent(<PrivacyPolicy />);
        hide()
    }

    const tosContent = `
# Terms of Service
*Last updated: December 06, 2025*

## Agreement to Terms
These Terms of Service constitute a legally binding agreement made between you ("User") and Wiktor Małyska ("we," "us," or "our"), regarding your access to and use of the "Yotei" mobile application (“App”).

## Nature of the Application
Yotei acts solely as a client-side interface (a specialized browser) designed to assist Users in visualizing and managing their personal schedule data. The App does not generate this data but fetches it from external services upon the User's direct request and authorization.

## Unofficial Status
Yotei is an independent, unofficial application developed by Wiktor Małyska. It is **not** affiliated, endorsed, authorized, maintained, sponsored, or in any way officially connected with Polsko-Japońska Akademia Technik Komputerowych (PJATK) or any of its subsidiaries or affiliates.

## User Responsibility for External Services
By using the App, you acknowledge and agree that:
1. You are solely responsible for any interactions between this App and external services (specifically PJATK systems).
2. You represent that you have the necessary authorization to access the data retrieved by the App.
3. The App acts as a user-agent on your behalf. Any data transmission to or from PJATK servers is initiated by you. We are not responsible for how external services process your requests or for any potential violations of their specific Terms of Service caused by your use of third-party tools.

## Data Privacy and Storage
Your privacy is paramount. Credentials and personal data are stored **locally on your device**. The App uses this data exclusively to authenticate with PJATK services directly from your device to retrieve necessary information. We do not collect, store, share, or transfer your login credentials or personal schedule data to our own servers or any third parties.

## Intellectual Property
The name "PJATK" as well as related names, marks, emblems, and images are registered trademarks of their respective owners. They are used in this App solely for identification and reference purposes and implies no association with the trademark holder.

## License to Use
We grant you a limited, non-exclusive, non-transferable license to use the App for personal, non-commercial purposes, provided you comply with these Terms.

## Limitation of Liability
The App is provided “as is” and “as available”. We specifically disclaim any liability for actions taken by third-party services (e.g., account suspension by the university) resulting from the use of this App. You use Yotei entirely at your own risk.

## Changes to Terms
We reserve the right to modify these Terms at any time. Continued use of the App signifies your acceptance of updated Terms.

## Governing Law
These Terms shall be governed by and construed in accordance with the laws of Poland.

## Contact Information
For questions about these Terms, contact: wiktormalyska03@gmail.com.
    `;

    // Style dla biblioteki Markdown (mapowanie tagów na style)
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
                    {tosContent}
                </Markdown>
            </ScrollView>
            <Button
                onClick={handleAccept}
                title={"Click to accept Terms of Service"}
                type={SidebarButtonType.SECONDARY}
            />
        </View>
    )
}