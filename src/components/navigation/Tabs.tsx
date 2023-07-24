import { FC, useState} from 'react';

import { default as JoyTabs } from '@mui/joy/Tabs';
import Box from '@mui/joy/Box';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

type Props = {
  tabLabels: JSX.Element[];
  tabContents: JSX.Element[];
}

export const Tabs: FC<Props> = (props) => {
  const [index, setIndex] = useState(0);

  return (
    <Box
      sx={{
        bgcolor: 'background.body',
        flexGrow: 1,
        m: -2,
        overflowX: 'hidden',
        borderRadius: 'md',
      }}
    >
      <JoyTabs
        aria-label="Pipeline"
        value={index}
        onChange={(_, value) => setIndex(value as number)}
        sx={{ '--Tabs-gap': '0px' }}
      >
        <TabList
          variant="plain"
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            pt: 2,
            alignSelf: 'flex-start',
            [`& .${tabClasses.root}`]: {
              bgcolor: 'transparent',
              boxShadow: 'none',
              outline: 'none',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'primary.100',
              },
              [`&.${tabClasses.selected}`]: {
                color: 'primary.plainColor',
                fontWeight: 'lg',
                bgcolor: 'transparent',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  zIndex: 1,
                  bottom: '-1px',
                  left: 'var(--ListItem-paddingLeft)',
                  right: 'var(--ListItem-paddingRight)',
                  height: '3px',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  bgcolor: 'primary.500',
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
        <Box
          sx={(theme) => ({
            '--bg': theme.vars.palette.background.level3,
            height: '1px',
            background: 'var(--bg)',
            boxShadow: '0 0 0 100vmax var(--bg)',
            clipPath: 'inset(0 -100vmax)',
          })}
        />
        <Box
          sx={(theme) => ({
            '--bg': theme.vars.palette.background.surface,
            background: 'var(--bg)',
            boxShadow: '0 0 0 100vmax var(--bg)',
            clipPath: 'inset(0 -100vmax)',
            px: 2,
            py: 2,
          })}
        >
          {props.tabContents.map((content, i) => (
            <TabPanel key={i} value={i}>
              {content}
            </TabPanel>
          ))}
        </Box>
      </JoyTabs>
    </Box>
  );
}; 
