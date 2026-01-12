module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
          native: {
            android: { useTransformReactJsxExperimental: true },
            ios: { useTransformReactJsxExperimental: true },
          },
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './',
          },
        },
      ],
    ],
  };
};
