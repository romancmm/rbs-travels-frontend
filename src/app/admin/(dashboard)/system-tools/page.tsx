'use client'

import { useMemo, useState } from 'react'

import PageHeader from '@/components/common/PageHeader'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import useAsync from '@/hooks/useAsync'
import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { Database, KeyRound, Loader2, RefreshCcw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type CacheRow = {
  key: string
  value?: unknown
  ttl?: number | string
}

type CacheApiResponse = {
  data?: unknown
  items?: CacheRow[]
  keys?: string[]
}

const CACHE_LIST_ENDPOINT = '/admin/cache?pattern=%2A&cursor=0&count=100'

const normalizeRows = (payload: CacheApiResponse | undefined): CacheRow[] => {
  if (!payload) return []

  const source = payload.data ?? payload

  if (Array.isArray(source)) {
    if (source.length === 0) return []

    if (typeof source[0] === 'string') {
      return (source as string[]).map((key) => ({ key }))
    }

    return (source as any[])
      .map((entry) => ({
        key: entry?.key ?? entry?.name ?? '',
        value: entry?.value,
        ttl: entry?.ttl
      }))
      .filter((entry) => Boolean(entry.key))
  }

  if (source && typeof source === 'object') {
    const objectSource = source as Record<string, unknown>

    if (Array.isArray(objectSource.items)) {
      return (objectSource.items as any[])
        .map((entry) => ({
          key: entry?.key ?? entry?.name ?? '',
          value: entry?.value,
          ttl: entry?.ttl
        }))
        .filter((entry) => Boolean(entry.key))
    }

    if (Array.isArray(objectSource.keys)) {
      return (objectSource.keys as string[]).map((key) => ({ key }))
    }

    return Object.entries(objectSource).map(([key, value]) => ({ key, value }))
  }

  return []
}

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export default function SystemTools() {
  const [deletingKey, setDeletingKey] = useState<string | null>(null)
  const [clearingAll, setClearingAll] = useState(false)
  const [deleteAllOpen, setDeleteAllOpen] = useState(false)
  const [deleteItemOpen, setDeleteItemOpen] = useState(false)
  const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null)

  const { data, loading, mutate, validating } = useAsync<CacheApiResponse>(
    CACHE_LIST_ENDPOINT,
    true
  )

  const cacheRows = useMemo(() => normalizeRows(data), [data])
  const isBusy = loading || validating || clearingAll

  const handleDeleteItem = async (key: string) => {
    try {
      setDeletingKey(key)
      await requests.delete(`/admin/cache/item?key=${encodeURIComponent(key)}`)
      toast.success('Cache item deleted')
      await mutate()
      setDeleteItemOpen(false)
      setPendingDeleteKey(null)
    } catch (error) {
      showError(error)
    } finally {
      setDeletingKey(null)
    }
  }

  const handleDeleteAll = async () => {
    try {
      setClearingAll(true)
      await requests.delete('/admin/cache/all')
      toast.success('All cache cleared')
      await mutate()
      setDeleteAllOpen(false)
    } catch (error) {
      showError(error)
    } finally {
      setClearingAll(false)
    }
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='System Tools'
        subTitle='Manage application cache entries'
        extra={
          <div className='flex flex-wrap items-center gap-2'>
            <Button variant='outline' onClick={() => mutate()} disabled={loading || validating}>
              {validating ? (
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
              ) : (
                <RefreshCcw className='mr-2 w-4 h-4' />
              )}
              Refresh
            </Button>
            <Button
              variant='destructive'
              onClick={() => setDeleteAllOpen(true)}
              disabled={clearingAll || loading || validating}
            >
              {clearingAll ? (
                <Loader2 className='mr-2 w-4 h-4 animate-spin' />
              ) : (
                <Trash2 className='mr-2 w-4 h-4' />
              )}
              {clearingAll ? 'Clearing...' : 'Delete All Cache'}
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className='space-y-4'>
          <div className='flex flex-wrap justify-between items-start gap-3'>
            <div>
              <CardTitle className='flex items-center gap-2'>
                <Database className='w-5 h-5' />
                Cache Keys
              </CardTitle>
              <CardDescription>Pattern: * | Cursor: 0 | Count: 100</CardDescription>
            </div>
            <Badge variant={cacheRows.length > 0 ? 'default' : 'secondary'}>
              {cacheRows.length} item(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='space-y-2'>
              <Skeleton className='w-full h-10' />
              <Skeleton className='w-full h-10' />
              <Skeleton className='w-full h-10' />
            </div>
          ) : cacheRows.length === 0 ? (
            <div className='flex flex-col justify-center items-center gap-2 py-12 border border-dashed rounded-lg text-center'>
              <Database className='w-8 h-8 text-muted-foreground' />
              <p className='font-medium'>No cache entries found</p>
              <p className='text-muted-foreground text-sm'>
                Try refreshing or check cache generation.
              </p>
            </div>
          ) : (
            <Table className='[&_tbody_tr:last-child]:border-0'>
              <TableHeader className='bg-muted/50'>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value Preview</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cacheRows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className='max-w-105 font-medium'>
                      <div className='flex items-center gap-2 min-w-0'>
                        <KeyRound className='w-4 h-4 text-muted-foreground shrink-0' />
                        <span className='truncate'>{row.key}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-95 text-muted-foreground truncate'>
                      {formatValue(row.value)}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>{row.ttl ?? '-'}</Badge>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => {
                          setPendingDeleteKey(row.key)
                          setDeleteItemOpen(true)
                        }}
                        disabled={deletingKey === row.key || isBusy}
                      >
                        {deletingKey === row.key ? (
                          <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                          <Trash2 className='w-4 h-4' />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteItemOpen} onOpenChange={setDeleteItemOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cache Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cache key?
              {pendingDeleteKey ? ` (${pendingDeleteKey})` : ''} This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingKey !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive hover:bg-destructive/90 text-white'
              onClick={(e) => {
                e.preventDefault()
                if (pendingDeleteKey) {
                  void handleDeleteItem(pendingDeleteKey)
                }
              }}
              disabled={!pendingDeleteKey || deletingKey !== null}
            >
              {deletingKey ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Cache</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all cache entries? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearingAll}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive hover:bg-destructive/90 text-white'
              onClick={(e) => {
                e.preventDefault()
                void handleDeleteAll()
              }}
              disabled={clearingAll}
            >
              {clearingAll ? 'Clearing...' : 'Delete All'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
