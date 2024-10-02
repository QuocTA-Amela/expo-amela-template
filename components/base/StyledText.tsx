import { logger } from "@/utils/helpers";
import i18next from "@/utils/i18next";
import * as React from "react";
import { memo, ReactNode } from "react";
import { TranslationKeys, useTranslation } from "react-i18next";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from "react-native";

export type I18Type = TranslationKeys;

interface StyledTextProps extends TextProps {
  customStyle?: StyleProp<TextStyle>;
  i18nParams?: any;
}

interface StyledTextWithOriginValue extends StyledTextProps {
  originValue: string;
  i18nText?: never;
}

interface StyledTextWithI18nValue extends StyledTextProps {
  originValue?: never;
  i18nText: I18Type;
  children?: ReactNode;
}

type StyledTextCombineProps =
  | StyledTextWithOriginValue
  | StyledTextWithI18nValue;

const StyledText = (props: StyledTextCombineProps) => {
  const { t } = useTranslation();
  const { style, originValue, i18nText, i18nParams, children, customStyle } =
    props;
  let value;

  if (style) {
    logger(
      "StyledText should use customStyle to avoid override default style text",
      true
    );
  }

  if (originValue) {
    value = originValue;
  } else if (i18nText || i18next.exists(i18nText || "", i18nParams)) {
    value = t(i18nText as I18Type, i18nParams);
  } else {
    value = i18nText || "";
  }

  return (
    <Text style={[styles.text, customStyle]} {...props}>
      {value}
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "black",
    fontSize: 14,
  },
});

export default memo(StyledText);
