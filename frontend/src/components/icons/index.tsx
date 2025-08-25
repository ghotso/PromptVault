import {
  Plus,
  Edit,
  Trash2,
  Search,
  Settings,
  Users,
  User,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  Info,
  Star,
  Tag,
  Copy,
  Download,
  Upload,
  FileText,
  Zap,
  Brain,
  MessageSquare,
  FolderOpen,
  Grid,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  Globe,
  Shield,
  Key,
  LogOut,
  LogIn,
  UserPlus,
  Home,
  BookOpen,
  Database,
  Server,
  Code,
  Palette,
  Sun,
  Moon,
  Monitor,
  type LucideIcon,
} from 'lucide-react'
import { useTheme } from '../../lib/theme'

interface IconProps {
  icon: LucideIcon
  size?: number
  className?: string
  color?: string
}

export function Icon({ icon: IconComponent, size = 20, className = '', color }: IconProps) {
  const { currentColors } = useTheme()
  const iconColor = color || currentColors.text.secondary

  return (
    <IconComponent
      size={size}
      className={className}
      color={iconColor}
      strokeWidth={1.5}
    />
  )
}

// Export all icons for easy access
export {
  Plus,
  Edit,
  Trash2,
  Search,
  Settings,
  Users,
  User,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  Info,
  Star,
  Tag,
  Copy,
  Download,
  Upload,
  FileText,
  Zap,
  Brain,
  MessageSquare,
  FolderOpen,
  Grid,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  Globe,
  Shield,
  Key,
  LogOut,
  LogIn,
  UserPlus,
  Home,
  BookOpen,
  Database,
  Server,
  Code,
  Palette,
  Sun,
  Moon,
  Monitor,
}
