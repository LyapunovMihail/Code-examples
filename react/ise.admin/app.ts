import "./app.scss"
import "../../scala/src/isportevent.com/static/stylesheets/flag-shiny.css"
import {react} from "../_react/core"
import {app} from "../_app/app"
import {AppState} from "./state"
import {Dashboard} from './ui/Dashboard'
import {Orgs} from './ui/Orgs'
import {Metrics} from './ui/Metrics'

app.bootstrap("ise.admin", {
  rootUrl : "/admin/dashboard",
  title : "Панель администрирования системы",
  state : AppState,
  styles : {
    root: "app-ise-admin",
    fluid: true,
  },
  pages : [
    { title: "Стартовая страница", view: Dashboard, icon: "dashboard" },
    { path: "metrics" , title: "Метрики", view: Metrics, icon : "timeline" },
    { path: "companies" , title: "Организации", view: Orgs, icon : "domain" }
  ]
})
