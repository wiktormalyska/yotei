// @ts-ignore
import YoteiLogo from '@/assets/svgs/yotei.svg';
// @ts-ignore
import PJATKLogoDark from '@/assets/svgs/PJATK_Dark.svg';
import {View} from "react-native";
import {useTheme} from "@/contexts/ThemeContext";
import {StyleSheet} from "react-native";


export const Logo = ({width = "24", height = "24"}) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return (
        <View style={styles.container}>
            {
                <YoteiLogo width={width} height={height}/>
            }

        </View>
    );
};