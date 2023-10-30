# Purpose: To represent a ball
# Author: Alex Wong

import pygame

from Drawable import Drawable


class Ball(Drawable):
    # Constructor
    def __init__(self, x, y, visible, radius, color):
        super().__init__(x, y, visible)
        self.__radius = radius
        self.__color = color

    # Getters
    def get_radius(self):
        return self.__radius

    def get_color(self):
        return self.__color

    def get_rect(self, surface):
        location = self.get_location()
        diameter = self.get_radius() * 2
        return pygame.Rect(location[0], location[1], diameter, diameter)

    # Setters
    def set_radius(self, radius):
        self.__radius = radius

    def set_color(self, color):
        self.__color = color

    # Draws this ball
    def draw(self, surface):
        location = self.get_location()
        pygame.draw.circle(surface, self.get_color(), (location[0], location[1]), self.get_radius())
