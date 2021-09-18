import VueRouter from "vue-router";
import Home from "@/views/Home";
import ProjectPage from "@/views/ProjectPage";
import NotFound from "@/views/NotFound"

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/project/:name',
        name: 'project',
        component: ProjectPage
    },
    {
        path: '*',
        name: 'notFound',
        component: NotFound
    }
]

const router = new VueRouter({
    history: true,
    mode: 'history',
    routes
})

export default router;