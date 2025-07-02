"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Home, LogOut, Paperclip, Search, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/context/auth-context"

// Mock conversations data
const mockConversations = [
  {
    id: "1",
    user: {
      id: "user-1",
      name: "Serena Hotels",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Thank you for your booking! We're looking forward to hosting you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
  },
  {
    id: "2",
    user: {
      id: "user-2",
      name: "Hunza Guides",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "The tour will start at 9:00 AM. Please be ready at the hotel lobby.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      isRead: false,
      sender: "them",
    },
    unreadCount: 2,
  },
  {
    id: "3",
    user: {
      id: "user-3",
      name: "Mountain View Restaurant",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    lastMessage: {
      text: "Your reservation for tomorrow at 7:00 PM is confirmed.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
  },
  {
    id: "4",
    user: {
      id: "user-4",
      name: "Fairy Meadows Cottages",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
    },
    lastMessage: {
      text: "Do you need transportation from Raikot Bridge to Fairy Meadows?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
  },
]

// Mock messages for a conversation
const mockMessages = [
  {
    id: "msg-1",
    text: "Hello! Thank you for booking with Serena Hotels. We're excited to welcome you to our property.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    sender: "them",
    isRead: true,
  },
  {
    id: "msg-2",
    text: "Hi! Thanks for the confirmation. I'm looking forward to my stay.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
    sender: "me",
    isRead: true,
  },
  {
    id: "msg-3",
    text: "Do you offer airport pickup services?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
    sender: "me",
    isRead: true,
  },
  {
    id: "msg-4",
    text: "Yes, we do offer airport pickup services. The cost is $30 for a one-way trip. Would you like us to arrange that for you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(), // 21 hours ago
    sender: "them",
    isRead: true,
  },
  {
    id: "msg-5",
    text: "That would be great! My flight arrives at 2:30 PM on Friday.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
    sender: "me",
    isRead: true,
  },
  {
    id: "msg-6",
    text: "Perfect! We've arranged the pickup for you. Our driver will be waiting at the arrivals area with a sign with your name.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 19).toISOString(), // 19 hours ago
    sender: "them",
    isRead: true,
  },
  {
    id: "msg-7",
    text: "Thank you! One more question - do you have recommendations for local attractions?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    sender: "me",
    isRead: true,
  },
  {
    id: "msg-8",
    text: "We recommend visiting Attabad Lake, Baltit Fort, and Eagle's Nest viewpoint. We can help arrange tours to these places when you arrive.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(), // 9 hours ago
    sender: "them",
    isRead: true,
  },
  {
    id: "msg-9",
    text: "That sounds perfect. I'm excited to explore the area!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    sender: "me",
    isRead: true,
  },
  {
    id: "msg-10",
    text: "Thank you for your booking! We're looking forward to hosting you.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    sender: "them",
    isRead: true,
  },
]

export function MessagingInterface() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      router.push("/login")
      return
    }

    // Set first conversation as active by default on desktop
    if (window.innerWidth >= 768 && conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id)
    }
  }, [user, router, conversations, activeConversation])

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation) return

    const newMsg = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      timestamp: new Date().toISOString(),
      sender: "me",
      isRead: false,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    // Update last message in conversation list
    setConversations(
      conversations.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              lastMessage: {
                text: newMessage,
                timestamp: new Date().toISOString(),
                isRead: false,
                sender: "me",
              },
            }
          : conv,
      ),
    )

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMsg = {
        id: `msg-${Date.now() + 1}`,
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toISOString(),
        sender: "them",
        isRead: false,
      }

      setMessages((prevMessages) => [...prevMessages, replyMsg])

      // Update last message in conversation list
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === activeConversation
            ? {
                ...conv,
                lastMessage: {
                  text: replyMsg.text,
                  timestamp: replyMsg.timestamp,
                  isRead: false,
                  sender: "them",
                },
                unreadCount: 1,
              }
            : conv,
        ),
      )
    }, 2000)
  }

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId)

    // Mark messages as read
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              lastMessage: { ...conv.lastMessage, isRead: true },
            }
          : conv,
      ),
    )
  }

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get active conversation data
  const currentConversation = conversations.find((conv) => conv.id === activeConversation)

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">Messages</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/tourist">
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar - Conversation List */}
        <div
          className={`border-r md:w-80 ${activeConversation && window.innerWidth < 768 ? "hidden" : "flex flex-col"}`}
        >
          <div className="hidden border-b p-4 md:block">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/tourist">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {filteredConversations.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                  <p className="text-sm text-muted-foreground">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-accent ${
                      activeConversation === conversation.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.user.avatar || "/placeholder.svg"}
                          alt={conversation.user.name}
                        />
                        <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.user.isOnline && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{conversation.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(conversation.lastMessage.timestamp), "h:mm a")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <p className="truncate text-sm text-muted-foreground">
                          {conversation.lastMessage.sender === "me" ? "You: " : ""}
                          {conversation.lastMessage.text}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div
          className={`flex flex-1 flex-col ${
            !activeConversation && window.innerWidth < 768 ? "hidden" : "flex flex-col"
          }`}
        >
          {activeConversation && currentConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveConversation(null)}>
                    <ArrowLeft className="h-5 w-5" />
                    <span className="sr-only">Back</span>
                  </Button>
                  <Avatar>
                    <AvatarImage
                      src={currentConversation.user.avatar || "/placeholder.svg"}
                      alt={currentConversation.user.name}
                    />
                    <AvatarFallback>{currentConversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{currentConversation.user.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {currentConversation.user.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "me"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p>{message.text}</p>
                        <div
                          className={`mt-1 text-right text-xs ${
                            message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                          }`}
                        >
                          {format(new Date(message.timestamp), "h:mm a")}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="shrink-0" disabled={!newMessage.trim()}>
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-4">
              <div className="text-center">
                <h3 className="mb-2 text-lg font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
