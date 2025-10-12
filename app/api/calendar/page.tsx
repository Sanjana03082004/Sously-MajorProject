"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Mic, Plus, ArrowLeft, CheckCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition"
import { useVoiceCommands } from "@/hooks/useVoiceCommands"

interface Task {
  _id?: string
  title: string
  time: string
  completed: boolean
  priority: "high" | "medium" | "low"
  createdAt: string
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [voiceCommand, setVoiceCommand] = useState("")
  const [loading, setLoading] = useState(true)

  const { transcript, isListening, startListening, stopListening, resetTranscript, error } = useSpeechRecognition()
  const { processCommand } = useVoiceCommands()

  // ✅ Fetch tasks from the backend when the page loads
  useEffect(() => {
    async function loadTasks() {
      try {
        const res = await fetch("/api/calendar")
        const data = await res.json()
        setTasks(data)
      } catch (err) {
        console.error("Error loading tasks:", err)
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  // ✅ Save new task to backend
  const addTask = async (
    title: string,
    time = "No time set",
    priority: "high" | "medium" | "low" = "medium"
  ) => {
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, time, priority }),
      })
      const newTask = await res.json()
      setTasks((prev) => [...prev, newTask])
    } catch (err) {
      console.error("Error adding task:", err)
    }
  }

  // ✅ Toggle complete in UI only (you can extend it to backend later)
  const toggleTask = (id: string | undefined) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === id ? { ...task, completed: !task.completed } : task))
    )
  }

  // ✅ Delete task from backend
  const deleteTask = async (id: string | undefined) => {
    if (!id) return
    try {
      await fetch("/api/calendar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      setTasks((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  // ✅ Add task manually
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim())
      setNewTaskTitle("")
    }
  }

  // ✅ Handle voice commands
  useEffect(() => {
    if (transcript) {
      const command = processCommand(transcript)
      if (command) {
        handleVoiceCommand(command)
        setVoiceCommand(`Processed: ${transcript}`)
        setTimeout(() => setVoiceCommand(""), 3000)
      }
    }
  }, [transcript, processCommand])

  const handleVoiceCommand = (command: any) => {
    switch (command.type) {
      case "schedule":
      case "task":
        const taskTitle = command.data.task || `${command.data.type} for ${command.data.time}`
        addTask(taskTitle, command.data.time || "No time set")
        break
      case "meeting":
        addTask(`Meeting with ${command.data.person}`, command.data.time)
        break
    }
  }

  const handleVoiceInput = () => {
    if (isListening) stopListening()
    else {
      resetTranscript()
      startListening()
      setTimeout(() => stopListening(), 10000)
    }
  }

  const upcomingEvents = [
    { title: "Project deadline", date: "Tomorrow", type: "work" },
    { title: "Doctor appointment", date: "Friday", type: "personal" },
    { title: "Weekend trip", date: "Saturday", type: "leisure" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Schedule & Tasks</h1>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {isListening ? "Listening..." : "Voice Ready"}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : (
          <>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Voice Command Feedback */}
            {voiceCommand && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{voiceCommand}</AlertDescription>
              </Alert>
            )}

            {/* Voice Input Section */}
            <Card className="mb-8 border-2 border-dashed border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Voice Commands</h3>
                    <p className="text-gray-600 text-sm">
                      Say things like "Schedule meeting tomorrow at 2 PM" or "Add task: Buy groceries"
                    </p>
                  </div>
                  <Button
                    onClick={handleVoiceInput}
                    className={`${
                      isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    {isListening ? "Listening..." : "Speak"}
                  </Button>
                </div>

                {transcript && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-800 text-sm">
                      <strong>You said:</strong> "{transcript}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tasks List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Today's Tasks ({tasks.filter((t) => !t.completed).length} remaining)</span>
                      <Button size="sm" variant="outline" onClick={handleAddTask}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div
                          key={task._id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                            task.completed
                              ? "bg-green-50 border-green-200 opacity-75"
                              : "bg-white border-gray-200 hover:shadow-sm"
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${
                              task.completed ? "text-green-600" : "text-gray-400 hover:text-green-600"
                            }`}
                            onClick={() => toggleTask(task._id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>

                          <div className="flex-1">
                            <div
                              className={`font-medium ${
                                task.completed ? "line-through text-gray-500" : "text-gray-800"
                              }`}
                            >
                              {task.title}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {task.time || "No time set"}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  task.priority === "high"
                                    ? "bg-red-100 text-red-700"
                                    : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-red-600"
                            onClick={() => deleteTask(task._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      {tasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No tasks yet. Add one above or use voice commands!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Add */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Add</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        placeholder="What do you need to do?"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={handleAddTask}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleVoiceInput}>
                          <Mic className="h-3 w-3 mr-1" />
                          Voice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
