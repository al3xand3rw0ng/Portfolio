# Purpose: To represent a fly
# Author: Alex Wong
import pygame

from Drawable import Drawable


class Fly(Drawable):
    def __init__(self, x, y, visible, color):
        super().__init__(x, y, visible)
        self.__color = color

    # Getters
    def get_color(self):
        return self.__color

    def get_rect(self, surface):
        location = self.get_location()
        return pygame.Rect(location[0], location[1], 40, 20 + 10 + 10)

    # Setters
    def set_color(self, color):
        self.__color = color

    def draw(self, surface):
        # Draw the body
        pygame.draw.ellipse(surface, self.get_color(), (self.get_location()[0], self.get_location()[1], 40, 20))

        # Draw the eye
        pygame.draw.circle(surface, (255, 0, 0), (self.get_location()[0] + 5, self.get_location()[1] + 5), 5)

        # Draw the legs (6 legs)
        for i in range(6):
            leg_x = self.get_location()[0] + 5 + i * 5
            pygame.draw.line(surface, (0, 0, 0), (leg_x, self.get_location()[1] + 15),
                             (leg_x, self.get_location()[1] + 25),
                             1)

        # Draw the wings (two oval shapes)
        pygame.draw.ellipse(surface, (169, 169, 169), (self.get_location()[0] + 10, self.get_location()[1], 35, 10), 2)
        pygame.draw.ellipse(surface, (169, 169, 169), (self.get_location()[0] + 10, self.get_location()[1] + 5, 35, 10),
                            2)
