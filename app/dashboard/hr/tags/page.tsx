'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/store'
import { formatDate } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { toast } from 'sonner'

const PRESET_COLORS = [
  '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#eab308',
  '#ef4444', '#06b6d4', '#ec4899', '#14b8a6', '#6366f1',
]

export default function TagsPage() {
  const { currentUser, tags, addTag, updateTag, deleteTag, requests, getHrActionByRequestId } =
    useApp()

  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [creating, setCreating] = useState(false)

  const [editTag, setEditTag] = useState<{ id: string; name: string; color: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const tagUsage = (tagId: string) => {
    return requests.filter(r => {
      const action = getHrActionByRequestId(r.id)
      return action?.tagIds.includes(tagId)
    }).length
  }

  const handleCreate = async () => {
    if (!newName.trim() || !currentUser) return
    setCreating(true)
    await new Promise(r => setTimeout(r, 400))
    addTag({ name: newName.trim(), color: newColor, createdBy: currentUser.id })
    toast.success(`Tag "${newName}" created`)
    setNewName('')
    setNewColor(PRESET_COLORS[0])
    setCreating(false)
  }

  const handleEdit = () => {
    if (!editTag || !editTag.name.trim()) return
    updateTag(editTag.id, { name: editTag.name, color: editTag.color })
    toast.success('Tag updated')
    setEditTag(null)
  }

  const handleDelete = (id: string) => {
    const tag = tags.find(t => t.id === id)
    deleteTag(id)
    toast.success(`Tag "${tag?.name}" deleted`)
    setDeleteConfirm(null)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/hr" className="text-zinc-400 hover:text-zinc-700">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Manage Tags</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Create and manage tags to categorize subscriptions
          </p>
        </div>
      </div>

      {/* Create Tag */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700">Create New Tag</CardTitle>
          <CardDescription className="text-xs">
            Tags help you organize subscriptions by team or category.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tagName">Tag Name</Label>
              <Input
                id="tagName"
                placeholder="e.g. Engineering, Sales..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none"
                    style={{ backgroundColor: color }}
                  >
                    {newColor === color && (
                      <span className="flex items-center justify-center text-white text-xs font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {newName && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Preview:</span>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium text-white"
                style={{ backgroundColor: newColor }}
              >
                {newName}
              </span>
            </div>
          )}

          <Button
            onClick={handleCreate}
            className="bg-zinc-900 hover:bg-zinc-800"
            disabled={!newName.trim() || creating}
          >
            {creating ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Tag
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Tags */}
      <Card className="border-zinc-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-zinc-700">
            Existing Tags ({tags.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <div className="text-center py-10">
              <Tag className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">No tags yet. Create your first tag above.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {tags.map((tag, idx) => (
                <div key={tag.id}>
                  {idx > 0 && <Separator />}
                  <div className="flex items-center gap-4 py-3">
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm px-2.5 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                        <span className="text-xs text-zinc-400">{tagUsage(tag.id)} subscription{tagUsage(tag.id) !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Created {formatDate(tag.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-700"
                        onClick={() =>
                          setEditTag({ id: tag.id, name: tag.name, color: tag.color })
                        }
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500"
                        onClick={() => setDeleteConfirm(tag.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editTag} onOpenChange={() => setEditTag(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          {editTag && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label>Tag Name</Label>
                <Input
                  value={editTag.name}
                  onChange={e => setEditTag(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditTag(prev => prev ? { ...prev, color } : null)}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                      style={{ backgroundColor: color }}
                    >
                      {editTag.color === color && (
                        <span className="flex items-center justify-center text-white text-xs font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {editTag.name && (
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full font-medium text-white"
                  style={{ backgroundColor: editTag.color }}
                >
                  {editTag.name}
                </span>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTag(null)}>Cancel</Button>
            <Button className="bg-zinc-900 hover:bg-zinc-800" onClick={handleEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-zinc-600">
            Are you sure you want to delete the tag{' '}
            <strong>{tags.find(t => t.id === deleteConfirm)?.name}</strong>? This action cannot be
            undone. The tag will be removed from all subscriptions.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
