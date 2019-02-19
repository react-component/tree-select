/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import Markdown from 'react-markdown';
import { checkA11y } from '@storybook/addon-a11y';
import { storiesOf } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';
import { withViewport } from '@storybook/addon-viewport';
import { withInfo } from '@storybook/addon-info';
import BasicSource from 'rc-source-loader!../examples/basic';
import BigDataSource from 'rc-source-loader!../examples/big-data';
import ControlledSource from 'rc-source-loader!../examples/controlled';
import CustomIconsSource from 'rc-source-loader!../examples/custom-icons';
import DisableSource from 'rc-source-loader!../examples/disable';
import DynamicSource from 'rc-source-loader!../examples/dynamic';
import FilterSource from 'rc-source-loader!../examples/filter';
import FormSource from 'rc-source-loader!../examples/form';
import Basic from '../examples/basic';
import BigData from '../examples/big-data';
import Controlled from '../examples/controlled';
import CustomIcons from '../examples/custom-icons';
import Disable from '../examples/disable';
import Dynamic from '../examples/dynamic';
import Filter from '../examples/filter';
import Form from '../examples/form';
import READMECode from '../README.md';

storiesOf('rc-tree-select', module)
  .addDecorator(checkA11y)
  .addDecorator(withInfo)
  .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
  .addDecorator(withViewport())
  .add(
    'readMe',
    () => (
      <div
        className="markdown-body entry-content"
        style={{
          padding: 24,
        }}
      >
        <Markdown escapeHtml={false} source={READMECode} />
      </div>
    ),
    {
      source: {
        code: READMECode,
      },
    },
  )
  .add('basic', () => <Basic />, {
    source: {
      code: BasicSource,
    },
  })
  .add('big-data', () => <BigData />, {
    source: {
      code: BigDataSource,
    },
  })
  .add('controlled', () => <Controlled />, {
    source: {
      code: ControlledSource,
    },
  })
  .add('custom-icons', () => <CustomIcons />, {
    source: {
      code: CustomIconsSource,
    },
  })
  .add('disable', () => <Disable />, {
    source: {
      code: DisableSource,
    },
  })
  .add('dynamic', () => <Dynamic />, {
    source: {
      code: DynamicSource,
    },
  })
  .add('filter', () => <Filter />, {
    source: {
      code: FilterSource,
    },
  })
  .add('form', () => <Form />, {
    source: {
      code: FormSource,
    },
  });
