import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView     from '../views/HomeView.vue'
import RoutineEditor from '../views/RoutineEditor.vue'
import ActiveTimer  from '../views/ActiveTimer.vue'
import QuickTimer   from '../views/QuickTimer.vue'
import WeightLog    from '../views/WeightLog.vue'
import AddWeight    from '../views/AddWeight.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',                    component: HomeView },
    { path: '/quick',               component: QuickTimer },
    { path: '/weight',              component: WeightLog },
    { path: '/weight/add',          component: AddWeight },
    { path: '/routine/new',         component: RoutineEditor },
    { path: '/routine/:id/edit',    component: RoutineEditor },
    { path: '/routine/:id/play',    component: ActiveTimer },
  ],
})
