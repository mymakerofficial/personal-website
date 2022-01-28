import VueRouter from "vue-router";
import Home from "@/views/Home";
import ProjectPage from "@/views/ProjectPage";
import ProjectEmbed from "@/views/ProjectEmbed";
import Projects from "@/views/Projects";
import Boids from "@/views/Boids";
import NotFound from "@/views/NotFound"

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/projects/:name',
        name: 'project',
        component: ProjectPage
    },
    {
        path: '/play/:name',
        name: 'playInBrowser',
        component: ProjectEmbed
    },
    {
        path: '/p/:name',
        redirect: { name: 'project' }
    },
    {
        path: '/project/:name',
        redirect: { name: 'project' }
    },
    {
        path: '/projects',
        name: 'projects',
        component: Projects
    },
    {
        path: '/boids',
        name: 'boids',
        component: Boids
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