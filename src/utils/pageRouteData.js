import WrokFlowComponent from '../Components/JiraDataComponent/WrokFlowComponent'
import WorkFLowScreens from '../Components/JiraDataComponent/WorkFLowScreens'
import ScreensComponent from '../Components/JiraDataComponent/ScreensComponent'
import ScreenSchemes from '../Components/JiraDataComponent/ScreenSchemes'
import CustomField from '../Components/JiraDataComponent/CustomField'
import NotificationSchemes from '../Components/JiraDataComponent/NotificationSchemes'
import PermissionSchemes from '../Components/JiraDataComponent/PermissionSchemes'
import PrioritySchemes from '../Components/JiraDataComponent/PrioritySchemes'
import IssueTypeScreenSchemes from '../Components/JiraDataComponent/IssueTypeScreenSchemes'
import IssueTypes from '../Components/JiraDataComponent/IssueTypes'
import FieldConfiguration from '../Components/JiraDataComponent/FieldConfiguration'
import FieldConfigurationSchemes from '../Components/JiraDataComponent/FieldConfigurationSchemes'
import Priorities from '../Components/JiraDataComponent/Priorities'
import Statuses from '../Components/JiraDataComponent/Statuses'
import Resolution from '../Components/JiraDataComponent/Resolution'
import IssueSecuritySchemes from '../Components/JiraDataComponent/IssueSecuritySchemes'
import Projects from '../Components/JiraDataComponent/Projects'
import IssueLinkTypes from '../Components/JiraDataComponent/IssueLinkTypes'
import Filter from '../Components/JiraDataComponent/Filter'
import Boards from '../Components/JiraDataComponent/Boards'
import DashBoradComponent from '../Components/JiraDataComponent/DashBoradComponent'
import Groups from '../Components/JiraDataComponent/Groups'
import Users from '../Components/JiraDataComponent/Users'
export const pageRouteData = [
   {
      path : '/workflows',
      component : WrokFlowComponent,
      name: "Workflow"
   },
   {
      path : '/workflow-schemes',
      component : WorkFLowScreens,
      name : "Workflow Schemes"
   },
   {
      path : "/screens",
      component: ScreensComponent,
      name : "Screens"
   },
   {
      path : "/screen-schemes",
      component: ScreenSchemes,
      name : "Screen Schemes"
   },
   {
      path : '/custom-field',
      component: CustomField,
      name : "Custom Fields"
   },
   {
      path : '/notification-schemes',
      component: NotificationSchemes,
      name : "Notification Schemes"
   },
   {
      path : '/permission-schemes',
      component:PermissionSchemes,
      name : "Permission Schemes"
   },
   {
      path : '/priority-schemes',
      component:PrioritySchemes,
      name : "Priority Schemes"
   },
   {
      path : '/issue-type-screen-schemes',
      component:IssueTypeScreenSchemes,
      name : "Issue Type Screen Schemes"
   },
   {
      path : '/issue-types',
      component:IssueTypes,
      name : "Issue Types"
   },
   {
      path : '/field-configuration',
      component:FieldConfiguration,
      name : "Field Configuration"
   },
   {
      path : '/field-configuration-schemes',
      component:FieldConfigurationSchemes,
      name : "Field Configuration Schemes"
   },
   {
      path : '/priorities',
      component:Priorities,
      name : "Priorities Page"
   },
   {
      path : '/statuses',
      component:Statuses,
      name : "Statuses Page"
   },
   {
      path : '/resolutions',
      component:Resolution,
      name : "Resolutions Page"
   },
   {
      path : '/issue-security-schemes',
      component:IssueSecuritySchemes,
      name : "Issues Security Schemes"
   },
   {
      path : '/projects',
      component:Projects,
      name : "Projects"
   },
   {
      path : '/issue-link-types',
      component: IssueLinkTypes,
      name : "Issue Link Types"
   },
   {
      path : '/filters',
      component: Filter,
      name : "Filters"
   },
   {
      path : '/boards',
      component: Boards,
      name : "Boards"
   },
   {
      path : '/dashboards',
      component: DashBoradComponent,
      name : "Dashboard"
   },
   {
      path : '/groups',
      component: Groups,
      name : "Groups"
   },
   {
      path : '/users',
      component: Users,
      name : "Users"
   },
]

export const deleteJiraCache = () => {
  const keysToRemove = [
    'cached_workflows',
    'cached_workflow_screens',
    'jira_screen_schemes_cache',
    'jira_screens_cache',
    'usersChache',
    'statusesCache',
    'resolutionsCache',
    'projectsCache',
    'prioritySchemesCache',
    'prioritiesCache',
    'permissionSchemescache',
    'notificationSchemescache',
    'issueTypeScreenSchemesCache',
    'issueTypesCache',
    'issue-security-schemes',
    'issue-link-types',
    'groupsCache',
    'filtersCache',
    'fieldConfigurationSchemes',
    'fieldConfigsCache',
    'dashboardsCache',
    'customFieldsCache',
    'boardsCache',

  ];

  keysToRemove.forEach(key => localStorage.removeItem(key));
};
