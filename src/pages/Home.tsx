import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonItem } from '@ionic/react';
import LogCard from '../components/LogCard'
import './Home.css';
import Achievement from '../model/Achievement';
import TaskListItem from '../components/TaskListItem';
import AchievementService from '../services/achievement-service';
import TaskService from '../services/task-service'
import Task from '../model/Task';

const Tab1: React.FC = () => {

  const achievementService = AchievementService()
  const taskService = TaskService()
  const emptyAchievements: Achievement[] = []
  let [achievements, setAchievements] = useState(emptyAchievements);
  const emptyTasks: Task[] = []
  let [tasks, setTasks] = useState(emptyTasks)

  useEffect(() => {
    const getAchievements = () => {
      achievementService.list()
      .then(result => {
        return result.sort((a, b) => {
          if (b.date < a.date) return -1
          else if (a.date === b.date) return 0
          else return 1
        })
      })
      .then(result => {
        setAchievements(result)
      },
      err => console.log(err))
    }

    const handler = () => getAchievements()
    achievementService.on('item:added', handler)
    achievementService.on('item:updated', handler)
    getAchievements()


    return () => {
      achievementService.off('item:added', handler)
      achievementService.off('item:updated', handler)
    }
  }, [])

  useEffect(() => {
    const getTasks = () => {
      taskService.list()
      .then(result => {
        setTasks(result)
      },
      err => console.log(err))
    }

    const handler = () => getTasks()
    taskService.on('item:added', handler)
    taskService.on('item:updated', handler)
    getTasks()

    return () => {
      taskService.off('item:added', handler)
      taskService.off('item:updated', handler)
    }
  }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          {tasks.map(task => <TaskListItem key={task.id} {...task}/>)} 
        </IonCard>

        <IonItem>
          <h2>Log</h2>
        </IonItem>

        {achievements.map(achievement => <LogCard key={achievement.id} {...achievement}></LogCard>)}

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
