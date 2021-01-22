import Reward from "./Reward";

export default interface Task {
    id: string
    icon: string;
    name: string;
    possibleRewards: Reward[]
}