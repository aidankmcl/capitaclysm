import { FC, useState, JSX } from "react";
import { Tabs as JoyTabs, TabList, Tab, TabPanel, tabClasses, Divider } from "@mui/joy";

type Props = {
  tabLabels: string[];
  tabContents: JSX.Element[];
};

export const Tabs: FC<Props> = (props) => {
  const [index, setIndex] = useState(0);

  return (
    <div className="bg-mint flex-grow -m-2 overflow-x-hidden rounded-md border border-lightGreen">
      <JoyTabs
        aria-label="Pipeline"
        value={index}
        onChange={(_, value) => setIndex(value as number)}
        sx={{ "--Tabs-gap": "0px", maxHeight: "100%" }}
      >
        <TabList
          variant="plain"
          className="w-full max-w-sm mx-auto pt-2 self-start"
          sx={{
            [`& .${tabClasses.root}`]: {
              bgcolor: "transparent",
              boxShadow: "none",
              outline: "none",
              borderRadius: 0,
              color: "var(--color-darkGreen)",
              "&:hover": {
                bgcolor: "var(--color-lightGreen)",
                color: "var(--color-mint)",
              },
              [`&.${tabClasses.selected}`]: {
                color: "var(--color-green)",
                fontWeight: "lg",
                bgcolor: "transparent",
                "&:before": {
                  content: "\"\"",
                  display: "block",
                  position: "absolute",
                  zIndex: 1,
                  bottom: "-1px",
                  left: "var(--ListItem-paddingLeft)",
                  right: "var(--ListItem-paddingRight)",
                  height: "3px",
                  borderTopLeftRadius: "3px",
                  borderTopRightRadius: "3px",
                  bgcolor: "var(--color-green)",
                },
              },
            },
          }}
        >
          {props.tabLabels.map((label, i) => (
            <Tab key={i}>
              {label}
            </Tab>
          ))}
        </TabList>
        <Divider className="border-lightGreen" />
        <div className="px-2 py-2 overflow-y-auto bg-mint shadow-inner">
          {props.tabContents.map((content, i) => (
            <TabPanel key={i} value={i} className="overflow-auto max-h-full">
              {content}
            </TabPanel>
          ))}
        </div>
      </JoyTabs>
    </div>
  );
}; 
