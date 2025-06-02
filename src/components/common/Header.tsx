// REACT
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';

// TRANSLATIONS
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = '5MinApp' }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: "#000" }]}>
            <Image source={require('../../../assets/images/logo_lg.png')} style={[styles.logo, { height: 40, width: 40 }]} />
            <Image source={require('../../../assets/images/name.png')} style={[styles.logo, { height: 16, width: 90 }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        padding: 2,
        borderColor: '#ccc',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        resizeMode: 'contain',
    },
});

export default Header;
