import Reward from "./Reward";
import Task from "./Task";

export default interface Achievement {
    id: string;
    date: string;
    task: Task;
    reward: Reward;
}