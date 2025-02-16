import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/user/login",
    name: "userLogin",
    component: () => import("../pages/user/UserLogin.vue"),
  },
  {
    path: "/user/register",
    name: "userRegister",
    component: () => import("../pages/user/UserRegister.vue"),
  },
  {
    path: "/user/userManage",
    name: "userManage",
    component: () => import("../pages/user/userManage.vue"),
  },
  {
    path: "/artifact/detect",
    name: "artifactDetect",
    component: () => import("../pages/Artifact/ArtifactDetect.vue"),
  },
  {
    path: "/artifact/remove",
    name: "artifactRemove",
    component: () => import("../pages/Artifact/ArtifactRemove.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
