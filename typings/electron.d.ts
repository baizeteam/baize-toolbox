import enUS from '@main/i18n/modules/en_US.json'

const resources = { translation: enUS } as const;

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
