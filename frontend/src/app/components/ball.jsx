'use client'
import { useEffect } from 'react'

export default function Ball() {
  useEffect(() => {
    const initThreeJS = async () => {
      const THREE = await import('three')
      const container = document.getElementById('ball-container')
      if (!container) return

      // Clear previous content
      container.innerHTML = ''

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      })
      renderer.setSize(500, 500)
      container.appendChild(renderer.domElement)

      // Bright realistic lighting setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
      scene.add(ambientLight)

      const keyLight = new THREE.DirectionalLight(0xffffff, 3)
      keyLight.position.set(4, 6, 5)
      keyLight.castShadow = true
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.8)
      fillLight.position.set(-3, 2, 4)
      scene.add(fillLight)

      const rimLight = new THREE.DirectionalLight(0xffffff, 1.0)
      rimLight.position.set(-2, -4, -3)
      scene.add(rimLight)

      const overheadLight = new THREE.DirectionalLight(0xffffff, 0.2)
      overheadLight.position.set(0, 8, 2)
      scene.add(overheadLight)

      // Create 10 marble balls with 3 colors
      const marbles = []
      const colors = [
        0x3b82f6, // blue-500
        0x00ee00,
 
       0xff0000
      ]

      const marbleGeometry = new THREE.SphereGeometry(0.15, 64, 64)

      for (let i = 0; i < 20; i++) {
        const colorIndex = i % 3
        const marbleMaterial = new THREE.MeshPhongMaterial({
          color: colors[colorIndex],
          shininess: 300,
          specular: 0x444444
        })
        
        const marble = new THREE.Mesh(marbleGeometry, marbleMaterial)
        
        // Random starting positions
        marble.position.x = (Math.random() - 0.5) * 4
        marble.position.y = (Math.random() - 0.5) * 4
        marble.position.z = (Math.random() - 0.5) * 4
        
        // Random movement properties for dust-like motion
        marble.userData = {
          velocityX: (Math.random() - 0.5) * 0.02,
          velocityY: (Math.random() - 0.5) * 0.02,
          velocityZ: (Math.random() - 0.5) * 0.02,
          rotationSpeedX: (Math.random() - 0.5) * 0.05,
          rotationSpeedY: (Math.random() - 0.5) * 0.05,
          rotationSpeedZ: (Math.random() - 0.5) * 0.05,
          driftX: Math.random() * 0.01,
          driftY: Math.random() * 0.01,
          driftZ: Math.random() * 0.01
        }
        
        scene.add(marble)
        marbles.push(marble)
      }

      camera.position.z = 4

      // Dust-like animation with random movement
      let time = 0
      const animate = () => {
        requestAnimationFrame(animate)
        time += 0.016

        marbles.forEach((marble, index) => {
          const userData = marble.userData
          
          // Add subtle random drift like dust particles
          userData.velocityX += (Math.random() - 0.5) * 0.001
          userData.velocityY += (Math.random() - 0.5) * 0.001
          userData.velocityZ += (Math.random() - 0.5) * 0.001
          
          // Apply velocity with some damping
          marble.position.x += userData.velocityX + Math.sin(time + index) * userData.driftX
          marble.position.y += userData.velocityY + Math.cos(time + index * 0.7) * userData.driftY
          marble.position.z += userData.velocityZ + Math.sin(time * 0.8 + index * 1.2) * userData.driftZ
          
          // Boundary checking - bounce off walls instead of wrapping
          if (marble.position.x > 2.5 || marble.position.x < -2.5) {
            userData.velocityX *= -0.8
            marble.position.x = Math.max(-2.5, Math.min(2.5, marble.position.x))
          }
          if (marble.position.y > 2.5 || marble.position.y < -2.5) {
            userData.velocityY *= -0.8
            marble.position.y = Math.max(-2.5, Math.min(2.5, marble.position.y))
          }
          if (marble.position.z > 2.5 || marble.position.z < -2.5) {
            userData.velocityZ *= -0.8
            marble.position.z = Math.max(-2.5, Math.min(2.5, marble.position.z))
          }
          
          // Random rotation like tumbling in space
          marble.rotation.x += userData.rotationSpeedX
          marble.rotation.y += userData.rotationSpeedY
          marble.rotation.z += userData.rotationSpeedZ
          
          // Damping to prevent velocities from getting too high
          userData.velocityX *= 0.995
          userData.velocityY *= 0.995
          userData.velocityZ *= 0.995
        })

        renderer.render(scene, camera)
      }
      animate()

      // Cleanup
      return () => {
        container.innerHTML = ''
        renderer.dispose()
      }
    }

    initThreeJS()
  }, [])

  return (
    <div
      id="ball-container"
      className="w-[500px] h-[500px] mt-20 p-10"
    />
  )
}