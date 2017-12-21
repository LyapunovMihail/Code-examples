import * as ReactCore from 'react'
export const React = ReactCore

export const $ = require("jquery")

export const moment = require("moment")
require("moment/locale/ru")

moment.locale('ru')

// https://www.typescriptlang.org/docs/handbook/modules.html
// Re-export declarations
export * from '../_react/viewComponent'
export * from '../_services/http'
export * from '../_services/events'
export * from '../_shared/reactComponent'
export * from '../_shared/tags'
export * from '../_services/timeSvc'
export * from '../_shared/toastr'
