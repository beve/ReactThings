import React from "react";
import { action } from "@storybook/addon-actions";

import Menu from "./Menu";

export default {
  component: Menu,
  title: "Menu",
  excludeStories: /.*Data$/
};

export const menuData = [
  {
    label: "Menu Entry 1",
    title: "",
    children: [
      {
        label: "Menu Sub #1",
        title: "",
        children: [
          {
            label: "Menu Sub 1#1",
            title: "",
            url: "#"
          },
          {
            label: "Menu Sub 1#2",
            title: "",
            url: "#"
          },
          {
            label: "Menu Sub 1#3",
            title: "",
            url: "#"
          }
        ]
      },
      {
        label: "Menu Sub #2",
        children: [
          {
            label: "Menu Sub 2#1",
            title: "",
            children: [
              {
                label: "Menu Sub 2#1#1",
                title: "",
                url: "#"
              },
              {
                label: "Menu Sub 2#1#2",
                title: "",
                url: "#"
              },
              {
                label: "Menu Sub 2#1#3",
                title: "",
                url: "#"
              }
            ]
          },
          {
            label: "Menu Sub 2#2",
            title: "",
            url: "#"
          },
          {
            label: "Menu Sub 2#3",
            title: "",
            url: "#"
          }
        ]
      }
    ]
  },
  {
    label: "Menu Entry 2",
    title: "",
    url: "#"
  },
  {
    label: "Menu Entry 3",
    title: "",
    url: "#"
  },
  {
    label: "Menu Entry 4",
    title: "",
    url: "#"
  },
  {
    label: "Menu Entry 5",
    title: "",
    url: "#",
    children: [
      {
        label: "Menu Sub #5",
        title: "",
        children: [
          {
            label: "Menu Sub 5#1",
            title: "",
            url: "#"
          },
          {
            label: "Menu Sub 5#2",
            title: "",
            url: "#"
          },
          {
            label: "Menu Sub 5#3",
            title: "",
            url: "#"
          }
        ]
      },
    ]
  },
  {
    label: "Menu Entry 6",
    title: "",
    url: "#"
  }
];

export const actionsData = {
  onLinkClick: action("onClick")
};

export const Default = () => {
  return <Menu menu={menuData} {...actionsData} />;
};
