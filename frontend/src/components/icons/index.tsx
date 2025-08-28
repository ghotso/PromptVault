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
  variant?: 'primary' | 'secondary' | 'on-bg'
}

export function Icon({ icon: IconComponent, size = 20, className = '', color, variant }: IconProps) {
  const { colorMode } = useTheme()
  
  const getIconColor = () => {
    if (color) return color
    
    if (variant === 'on-bg') {
      return colorMode === 'light' ? 'rgb(255 255 255)' : 'rgb(0 3 112)'
    }
    
    if (variant === 'secondary') {
      return colorMode === 'light' ? 'rgb(76 201 240)' : 'rgb(76 201 240)'
    }
    
    // primary variant (default)
    return colorMode === 'light' ? 'rgb(0 3 112)' : 'rgb(198 247 40)'
  }

  return (
    <IconComponent
      size={size}
      className={className}
      color={getIconColor()}
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
