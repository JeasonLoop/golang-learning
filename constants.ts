import { Module, VisualizationType } from './types';

export const GO_COLOR_PRIMARY = '#00ADD8'; // Go Gopher Blue
export const GO_COLOR_SECONDARY = '#CE3262';

export const CURRICULUM: Module[] = [
  {
    id: 'basics',
    title: 'Go 基础',
    icon: 'BookOpen',
    lessons: [
      {
        id: 'hello-world',
        title: '你好, 世界',
        description: '编写你的第一个 Go 程序。',
        content: `Go 是一门编译型、静态类型的语言。每个可运行的 Go 程序都必须位于一个名为 \`main\` 的包中。
        
**核心知识点：**
- **package main**: 定义包名，可执行程序的入口包必须是 main。
- **import "fmt"**: 引入格式化 I/O 标准库。
- **func main()**: 程序的主入口函数，没有参数也没有返回值。`,
        initialCode: `package main

import "fmt"

func main() {
    fmt.Println("你好，Go语言！")
}`,
        visualizationType: VisualizationType.NONE
      },
      {
        id: 'variables',
        title: '变量与类型',
        description: '理解 Go 如何存储数据。',
        content: `Go 是静态类型语言。你可以使用 \`var\` 关键字或者短变量声明运算符 \`:=\` 来声明变量。
        
**核心知识点：**
- **var**: 标准变量声明，可以指定类型。
- **:=**: 短变量声明，只能在函数内部使用，编译器会自动推导类型。
- **基本类型**: 包括 \`string\` (字符串), \`int\` (整数), \`bool\` (布尔), \`float64\` (浮点数) 等。`,
        initialCode: `package main

import "fmt"

func main() {
    // 标准声明
    var name string = "Gopher"
    
    // 短变量声明 (推导为 int)
    age := 10
    
    fmt.Printf("%s 已经 %d 岁了\\n", name, age)
}`,
        visualizationType: VisualizationType.VARIABLE
      }
    ]
  },
  {
    id: 'memory',
    title: '内存与指针',
    icon: 'Cpu',
    lessons: [
      {
        id: 'pointers',
        title: '理解指针',
        description: '可视化内存地址与引用。',
        content: `指针保存了值的内存地址。Go 语言支持指针，但不支持指针运算（如 C++ 那样）。
        
**核心操作符：**
- **& (取址)**: 获取变量在内存中的地址。
- **\\* (解引用)**: 读取指针指向内存地址中存储的值。`,
        initialCode: `package main

import "fmt"

func main() {
    x := 42
    p := &x         // p 指向 x 的地址
    
    fmt.Println("p 的值 (地址):", p)
    fmt.Println("p 指向的值:", *p) 
    
    *p = 21         // 通过指针修改 x
    fmt.Println("x 的新值:", x)
}`,
        visualizationType: VisualizationType.POINTER
      },
      {
        id: 'slices',
        title: '切片 (Slice) 内部原理',
        description: '切片是对数组的动态视图。',
        content: `切片本身不存储数据，它只是对底层数组的描述。
        
**切片三要素：**
1. **指针 (Ptr)**: 指向底层数组中切片开始的元素。
2. **长度 (Len)**: 切片包含的元素个数。
3. **容量 (Cap)**: 从切片开始位置到底层数组末尾的元素个数。`,
        initialCode: `package main

import "fmt"

func main() {
    // 创建一个数组
    primes := [6]int{2, 3, 5, 7, 11, 13}
    
    // 创建切片：包含索引 1 到 3 的元素 (不含 4)
    var s []int = primes[1:4]
    
    fmt.Printf("切片: %v\\n", s)
    fmt.Printf("长度: %d, 容量: %d\\n", len(s), cap(s))
}`,
        visualizationType: VisualizationType.SLICE
      }
    ]
  },
  {
    id: 'concurrency',
    title: '并发编程',
    icon: 'Zap',
    lessons: [
      {
        id: 'goroutines',
        title: 'Goroutine (协程)',
        description: 'Go 运行时管理的轻量级线程。',
        content: `Goroutine 是由 Go 运行时管理的轻量级线程。相比操作系统线程，它的创建成本极低。
        
**使用方法：**
只需在函数调用前加上 \`go\` 关键字，即可启动一个新的 Goroutine。`,
        initialCode: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    // 启动一个新的协程
    go say("世界")
    
    // 当前主协程继续执行
    say("你好")
}`,
        visualizationType: VisualizationType.GOROUTINE
      },
      {
        id: 'channels',
        title: 'Channel (通道)',
        description: '连接并发 Goroutine 的管道。',
        content: `Channel 是 Goroutine 之间通信的管道。你可以用 \`make\` 创建通道，用 \`<-\` 发送或接收值。
        
**特性：**
- 默认情况下，发送和接收都会阻塞，直到另一端准备好。
- 这使得 Goroutine 可以在没有显式锁或条件变量的情况下同步。`,
        initialCode: `package main

import "fmt"

func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum // 将 sum 发送到通道 c
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}
    c := make(chan int)
    
    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    
    x, y := <-c, <-c // 从 c 接收
    
    fmt.Println(x, y, x+y)
}`,
        visualizationType: VisualizationType.CHANNEL
      }
    ]
  }
];