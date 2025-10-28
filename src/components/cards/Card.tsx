import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

    interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    borderRadius?: number;
    elevation?: number;
    padding?: number;
    shadowColor?: string;
    }

    const Card: React.FC<CardProps> = ({
    children,
    style = {},
    backgroundColor = '#fff',
    borderRadius = 5,
    elevation = 3,
    padding = 16,
    shadowColor = '#CCCCCC',
    }) => {
    return (
        <View
        style={[
            styles.card,
            {
            backgroundColor,
            borderRadius,
            elevation,
            padding,
            shadowColor,
            },
            style,
        ]}
        >
        {children}
        </View>
    );
    };

    const styles = StyleSheet.create({
    card: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        marginVertical: 8,
    },
    });

    export default Card;
