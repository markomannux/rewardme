import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonItem, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonIcon, IonLabel, IonAlert } from '@ionic/react';
import LogCard from '../components/LogCard'
import './Home.css';
import Achievement from '../model/Achievement';
import TaskListItem from '../components/TaskListItem';
import AchievementService from '../services/achievement-service';
import TaskService from '../services/task-service'
import Task from '../model/Task';
import { flash } from 'ionicons/icons'

const Tab1: React.FC = () => {

  const achievementService = AchievementService()
  const taskService = TaskService()
  const emptyAchievements: Achievement[] = []
  let [achievements, setAchievements] = useState(emptyAchievements);
  let [achievementToDelete, setAchievementToDelete] = useState<Achievement>();
  const emptyTasks: Task[] = []
  let [tasks, setTasks] = useState(emptyTasks)
  const [showAlert, setShowAlert] = useState(false)

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
    achievementService.on('item:deleted', handler)
    getAchievements()


    return () => {
      achievementService.off('item:added', handler)
      achievementService.off('item:updated', handler)
      achievementService.off('item:deleted', handler)
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
    taskService.on('item:deleted', handler)
    getTasks()

    return () => {
      taskService.off('item:added', handler)
      taskService.off('item:updated', handler)
      taskService.off('item:deleted', handler)
    }
  }, [])

  let taskList
  if (tasks.length > 0) {
    taskList = (<IonCard>
          {tasks.map(task => <TaskListItem key={task.id} {...task}/>)}
        </IonCard>)
  } else {
    taskList = <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Hey!</IonCardSubtitle>
            <IonCardTitle>No tasks!</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            It seems you didn't set up any task. Let's find something to do!
          </IonCardContent>
          <IonCardContent>
            <IonButton expand="block" routerLink="/settings/tasks">Set up tasks</IonButton>
          </IonCardContent>
      </IonCard>
  }

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

        <IonItem>
          <h2>Recurring tasks</h2>
        </IonItem>
        {taskList} 

        <section className="rewardme-cta">
          <IonLabel>
            Add an achievement on the fly
          </IonLabel>
          <IonButton expand="block" routerLink="/home/instatask">
            <IonIcon slot="start" icon={flash} />
            Instatask
          </IonButton>
        </section>

        <IonItem>
          <h2>Log</h2>
        </IonItem>

        {achievements.map(achievement => <LogCard key={achievement.id} achievement={achievement} onPressDelete={() => {
          setAchievementToDelete(achievement)
          setShowAlert(true)
        }}></LogCard>)}
        <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='my-custom-class'
        header={'Delete Achievement'}
        message={'Do you really want to delete this achievement?'}
        buttons={[{
          text: "Nope",
          role: 'cancel'
        },
        {
          text: "Yes, please!",
          handler: () => {
            if (achievementToDelete) {
              achievementService.delete(achievementToDelete)
              setAchievementToDelete(undefined)
            }
          }
        }]}
      />

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
