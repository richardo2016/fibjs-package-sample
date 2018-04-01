# Fibjs Simple Server

## Pre-requisite

- nodejs(>= 6.0.0)
- fibjs(latest recommended)

## Get Started

### Before Development/Package

**NOTICE**
make sure `src/conf/.env.rc.jsc` existing, just:

- copy `src/conf/.env.rc.tpl` to `src/conf/.env.rc` and modify config in `src/conf/.env.rc`
- run `npm run build:env` before you start

### Not Start!

```bash
# development
npm run dev

# build production
npm run build:prod
```

## package

view details in
- `tools/build.js`
- `tools/build.env.rc.js`

## mysql
you should set you mysql connection string in

- `src/conf/.env.rc`(for prod)
- `src/conf/alpha.json`(for dev)

to complete connection to mysql database
