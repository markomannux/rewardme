import Reward from "./Reward";
import Task from "./Task";

export default interface Achievement {
    id?: string;
    date: Date;
    task: Task;
    reward: Reward;
    spent: string;
}