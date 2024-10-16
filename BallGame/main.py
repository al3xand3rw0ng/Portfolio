# Purpose: To create a ball game using pygame
# Author: Alex Wong

import asyncio
import math
import random

import pygame

from Ball import Ball
from Fly import Fly
from Line import Line
from Text import Text

# colors
black = (0, 0, 0)
red = (230, 0, 0)
green = (172, 240, 120)
blue = (155, 217, 250)


def intersect(rect1, rect2):
    """
    Purpose: To test if the ball has intersected the fly.
    Parameter: The rectangle of the ball and the rectangle of the fly are passed in as parameters.
    Returns: The function will return true or false depending on whether the ball's rectangle has intersected the rectangle of the fly or not.
    """
    if (rect1.x < rect2.x + rect2.width) and (rect1.x + rect1.width > rect2.x) and (
            rect1.y < rect2.y + rect2.height) and (rect1.height + rect1.y > rect2.y):
        return True
    return False

async def main():
    # Initialization
    pygame.init()

    # The display is initialized
    surface = pygame.display.set_mode((600, 500))
    WHITE = (255, 255, 255)
    surface.fill(WHITE)

    # This is the caption of the display window
    pygame.display.set_caption('Ball Game')

    fpsClock = pygame.time.Clock()

    # This list will contain all instances of the fly class
    flies = []

    # The ground plane is created.
    groundPlane = Line(600, 410, True)

    # Visibility is set to true, meaning that the flies will be visible
    visibility = True

    state = Text(530, 0, "moving", True)
    pause = False

    # The flies are all created at different locations and added to the list of flies.
    while len(flies) < 6:
        x = random.randint(40, 560)
        y = random.randint(40, 360)
        for fly in flies:
            if fly.get_location()[0] - 40 <= x <= fly.get_location()[0] + 40:
                x = random.randint(40, 560)
            if fly.get_location()[1] - 40 <= x <= fly.get_location()[1] + 40:
                y = random.randint(40, 360)

        color = [(0, 0, 0), (1, 50, 32), (92, 64, 51)]
        idx = random.randint(0, 2)

        fly = Fly(x, y, visibility, color[idx])
        flies.append(fly)

    # The ball is created
    ball = Ball(25, 400, True, 10, red)

    # The text is created
    score = 0
    score_text = Text(0, 0, f'Score: {score}', True)

    # The variable stores a boolean value. Because it is false, it means that the mouse is not released.
    release = False

    # The creation of the movement variables.
    xv = 0
    yv = 0
    dt = 0.1
    g = 6.67
    R = 0.7
    eta = 0.5

    # The game loop is created.
    while True:
        # Objects are drawn on the screen.
        surface.fill(WHITE)
        # The sky
        pygame.draw.rect(surface, blue, (0, 0, 600, 410))
        # The ground
        pygame.draw.rect(surface, green, (0, 410, 600, 100))
        groundPlane.draw(surface)
        ball.draw(surface)
        score_text.draw(surface)
        state.draw(surface)

        for fly in flies:
            # If the fly is visible, it is drawn.
            if fly.get_visible():
                fly.draw(surface)

        if score == 6:
            surface.fill(WHITE)
            # Objects are drawn on the screen.
            winningMessage = Text(270, 220, "Winner!", True)
            restartMessage = Text(200, 250, "Hit \"return\" to restart!", True)
            winningMessage.draw(surface)
            restartMessage.draw(surface)

        for event in pygame.event.get():
            # Event handling for exiting
            if (event.type == pygame.QUIT) or (
                    event.type == pygame.KEYDOWN and event.__dict__['key'] == pygame.K_q):
                pygame.quit()
                exit()
            # Event handling for when the mouse button is down.
            elif (event.type == pygame.MOUSEBUTTONDOWN):
                # If it is not released, the position of the mouse is collected and stored in the variable mousePositionDown.
                if not release:
                    mousePositionDown = pygame.mouse.get_pos()
            elif (event.type == pygame.MOUSEBUTTONUP):
                if not release:
                    # The position of the mouse is collected when the mouse button is not being held down after throwing.
                    mousePositionUp = pygame.mouse.get_pos()
                    # The initial x and y velocities are calculated
                    xv = mousePositionDown[0] - mousePositionUp[0]
                    yv = (-1) * (mousePositionDown[1] - mousePositionUp[1])
                    # Release is set to true because the mouse has been released.
                    release = True
            elif event.type == pygame.KEYDOWN:

                # If the user hits the r key, the balls position moves back to the default.
                if event.__dict__['key'] == pygame.K_r:
                    yv = 0
                    xv = 0
                    ball.set_location((25, 400))
                elif event.__dict__['key'] == pygame.K_SPACE:
                    if pause:
                        state = Text(530, 0, "moving", True)
                        pause = False
                    else:
                        state = Text(565, 0, "idle", True)
                        pause = True
                if event.__dict__['key'] == pygame.K_RETURN and score == 6:
                    main()

        # Controls the movement of the flies
        if not pause:
            for fly in flies:
                if fly.get_visible():
                    # Generate a random angle in radians for each fly
                    angle = random.uniform(0, 2 * math.pi)

                    # Set a movement speed (adjust as needed for desired smoothness)
                    speed = 5.0  # You can adjust this value

                    # Calculate the new position based on the angle and speed
                    new_x = fly.get_location()[0] + math.cos(angle) * speed
                    new_y = fly.get_location()[1] + math.sin(angle) * speed

                    # Ensure the fly stays within the screen boundaries
                    new_x = max(0, min(new_x, 600 - 40))
                    new_y = max(0, min(new_y, 410 - 40))

                    fly.set_location((new_x, new_y))

        # for all flies in the list of flies, the collision with the ball is tested.
        for fly in flies:
            rect1 = fly.get_rect(surface)
            rect2 = ball.get_rect(surface)
            visibility = intersect(rect1, rect2)
            if visibility and fly.get_visible():
                # If the ball is detected to collide with the fly, the score is updated and the fly is set to not visible.
                score += 1
                score_text.set_text(f'Score: {score}')
                score_text.draw(surface)
                fly.set_visible(False)

        if release:
            # The location of the ball is collected
            ball_location = ball.get_location()
            # The new x and y positions are calculated
            x = ball_location[0] + dt * xv
            y = ball_location[1] - dt * yv
            newBallLocation = (x, y)
            # The location of the ball changes based off of the new x and y location.
            ball.set_location(newBallLocation)

            # If the absolute value of yv is greater than 0.0001 and xv is greater than 0.1, the location is updated.
            if abs(yv) > 0.0001 and xv > 0.1:
                # If the ball is below the ground, its velocity is reversed.
                if ball_location[1] > 400:
                    newBallLocation = (ball_location[0], 400)
                    ball.set_location(newBallLocation)
                    yv = (-1) * R * yv
                    xv = eta * xv
                # If the ball is above the ground, the initial y velocity is altered.
                else:
                    yv = yv - g * dt
            # If the absolute value of yv is not greater than 0.0001 and xv is not greater than 0.1, the location is updated.
            else:
                release = False
                xv = 0
                yv = 0
                newBallLocation = (ball_location[0], 400)
                ball.set_location(newBallLocation)

        pygame.display.update()
        fpsClock.tick(25)

        await asyncio.sleep(0)


if __name__ == "__main__":
    asyncio.run(main())
