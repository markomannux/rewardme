import React, { useEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonPage, IonItem, IonTitle, IonToolbar, IonCardSubtitle, IonCardContent } from '@ionic/react';
import TaskService from '../services/task-service';
import AchievementService from '../services/achievement-service';
import { RouteComponentProps, useHistory } from 'react-router';
import Task from '../model/Task';
import Reward from '../model/Reward';
import { v4 as uuidv4 } from 'uuid';
import RewardCard from '../components/RewardCard';

interface CompleteTaskProps extends RouteComponentProps<{
  id: string
}> {}

const CompleteTask: React.FC<CompleteTaskProps> = ({match}) => {

  const taskService = TaskService()
  const history = useHistory();
  const achievementService = AchievementService()
  let [task, setTask] = useState<Task>()

  useEffect(() => {
    const getTask = () => {
        taskService.get(match.params.id)
        .then(result => {
            setTask(result)
        },
        err => console.log(err));
    }
    
    getTask()
  }, [])


  const handleRewardTap = (task: Task, reward: Reward) => {
    const now = new Date()
    const id = uuidv4()
    const achievement = {
      id: id,
      task,
      reward,
      date: `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`,
    }
    achievementService.add(achievement)
    .then(() => {
      history.push('/')
    })
    .catch(

    )
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Choose a reward</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Congratulations!</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img src='assets/trophy.jpg' />
          <IonCardHeader>
            <IonCardSubtitle>You completed</IonCardSubtitle>
            <IonCardTitle>{task?.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Keep up with the good job and enjoy your reward!
          </IonCardContent>
        </IonCard>
        <IonItem>
          Choose one
        </IonItem>
        {task?.possibleRewards.map((reward) => {
          return <RewardCard key={reward.id} reward={reward} onPress={() => {
              if (task) {
                handleRewardTap(task, reward)
              }
          }}></RewardCard>
        })}
        <IonItem>
          <a href="https://www.vecteezy.com/free-vector/1">1 Vectors by Vecteezy</a>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default CompleteTask;
