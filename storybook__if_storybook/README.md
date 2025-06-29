# Storybook Integration

This project includes Storybook for component development and testing. Storybook allows you to develop and test your Aurelia 2 components in isolation.

## Getting Started

To start Storybook in development mode, run:

```bash
npm run storybook
```

This will start Storybook on http://localhost:6006

To build Storybook for production:

```bash
npm run build-storybook
```

## Writing Stories

Stories are written in `.stories.ts` (or `.stories.js`) files alongside your components. Here's a basic example:

```typescript
import { MyComponent } from './my-component';

const meta = {
  title: 'Example/MyComponent',
  component: MyComponent,
  render: (args) => ({
    template: `<my-component message.bind="message"></my-component>`,
  }),
  argTypes: {
    message: { control: 'text' }
  }
};

export default meta;

export const Default = {
  args: {
    message: 'Hello World!'
  }
};
```

## Features

- **Interactive Controls**: Use Storybook's Controls addon to dynamically change component properties
- **Actions**: Track and display component events using the Actions addon
- **Testing**: Write interaction tests using Storybook's testing utilities

## Learn More

- [Storybook Documentation](https://storybook.js.org/docs)
- [Aurelia Storybook Integration](https://github.com/aurelia/storybook)
- [Aurelia 2 Documentation](https://docs.aurelia.io) 