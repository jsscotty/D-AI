// basic language switcher
"use client";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
} from "@chakra-ui/react";
import { Link, usePathname, useRouter } from "@/navigation";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { GB, DE } from "country-flag-icons/react/3x2";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const trans = useTranslations("locale");
  const locale = trans("locale");

  function toggleLocale(new_locale: "en" | "de") {
    router.replace(pathname, { locale: new_locale });
  }

  const menuButtonRef = useRef(null);

  return (
    <Menu placement={"right-start"}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        ref={menuButtonRef}
        size={"sm"}
        leftIcon={locale === "de" ? <DE /> : <GB />}
      >
       {locale === "de" ? "Deutsch" : "English"}
      </MenuButton>
      <MenuList>
        <MenuItem icon={<Icon as={GB} />} onClick={() => toggleLocale("en")}>
          English
        </MenuItem>
        <MenuItem icon={<Icon as={DE} />} onClick={() => toggleLocale("de")}>
          Deutsch
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
